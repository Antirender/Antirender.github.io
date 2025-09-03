// accelerator_top.sv
// Top-level wrapper for Transformer-based AI inference ASIC accelerator
// Instantiates control, DMA, cache, memory interface, compute engine, interconnect, PCIe, and debug modules.

`timescale 1ns/1ps
import common_pkg::*;

module AcceleratorTop #(
    parameter ADDR_WIDTH     = 64,
    parameter DATA_WIDTH     = 512,
    parameter CACHE_SIZE     = 134217728,  // 128MB on-chip cache
    parameter NUM_CORES      = 4,
    parameter CACHE_LINE_BE  = 64
) (
    //-------------------------------------------------------------------------
    // Clocks & Resets
    input  logic              clk_core,     // 1.2 GHz compute clock
    input  logic              clk_axi,      // AXI bus clock
    input  logic              clk_pcie,     // PCIe clock domain
    input  logic              rstn,         // active-low reset
    input  logic              scan_enable,  // DFT scan enable
    input  logic              test_mode,    // DFT test mode

    //-------------------------------------------------------------------------
    // PCIe/CXL host interface (simplified)
    input  logic [255:0]      pcie_rx_data,
    input  logic              pcie_rx_valid,
    output logic [255:0]      pcie_tx_data,
    output logic              pcie_tx_valid,
    output logic              pcie_irq,     // interrupt to host

    //-------------------------------------------------------------------------
    // External memory interface (e.g., DDR5)
    output logic [ADDR_WIDTH-1:0] mem_addr,
    inout  logic [DATA_WIDTH-1:0] mem_data,
    output logic                  mem_cmd_valid,
    input  logic                  mem_cmd_ready,
    output logic                  mem_rd_wrn,       // 1=read, 0=write
    output logic [7:0]            mem_be,           // byte enables
    input  logic                  mem_data_valid,
    output logic                  mem_data_ready,

    //-------------------------------------------------------------------------
    // Configuration / Status registers (AXI-Lite or APB interface)
    input  logic                  cfg_axi_aw_valid,
    output logic                  cfg_axi_aw_ready,
    input  logic [31:0]           cfg_axi_aw_addr,
    input  logic                  cfg_axi_w_valid,
    output logic                  cfg_axi_w_ready,
    input  logic [31:0]           cfg_axi_w_data,
    output logic                  cfg_axi_b_valid,
    input  logic                  cfg_axi_b_ready,

    input  logic                  cfg_axi_ar_valid,
    output logic                  cfg_axi_ar_ready,
    input  logic [31:0]           cfg_axi_ar_addr,
    output logic                  cfg_axi_r_valid,
    input  logic                  cfg_axi_r_ready,
    output logic [31:0]           cfg_axi_r_data

    //-------------------------------------------------------------------------
    // Add other IO (GPIO, debug UART, etc.) as needed
);

//------------------------------------------------------------------------------
// Internal nets
logic                         dma_start;
logic                         dma_done;
logic                         cache_hit;
logic                         cache_miss;
logic [ADDR_WIDTH-1:0]        dma_addr;
logic [DATA_WIDTH-1:0]        dma_wdata;
logic [DATA_WIDTH-1:0]        dma_rdata;

//------------------------------------------------------------------------------
// 1) Configuration & Control Registers
config_reg #(
    .ADDR_WIDTH   (ADDR_WIDTH),
    .DATA_WIDTH   (32)
) u_config_reg (
    .clk           (clk_axi),
    .rstn          (rstn),
    .scan_enable   (scan_enable),
    .test_mode     (test_mode),
    // AXI-Lite slave ports
    .s_aw_valid    (cfg_axi_aw_valid),
    .s_aw_ready    (cfg_axi_aw_ready),
    .s_aw_addr     (cfg_axi_aw_addr),
    .s_w_valid     (cfg_axi_w_valid),
    .s_w_ready     (cfg_axi_w_ready),
    .s_w_data      (cfg_axi_w_data),
    .s_b_valid     (cfg_axi_b_valid),
    .s_b_ready     (cfg_axi_b_ready),
    .s_ar_valid    (cfg_axi_ar_valid),
    .s_ar_ready    (cfg_axi_ar_ready),
    .s_ar_addr     (cfg_axi_ar_addr),
    .s_r_valid     (cfg_axi_r_valid),
    .s_r_ready     (cfg_axi_r_ready),
    .s_r_data      (cfg_axi_r_data),
    // Control ports
    .o_dma_start   (dma_start),
    .i_dma_done    (dma_done)
);

//------------------------------------------------------------------------------
// 2) DMA Engine
dma_engine #(
    .ADDR_WIDTH   (ADDR_WIDTH),
    .DATA_WIDTH   (DATA_WIDTH)
) u_dma_engine (
    .clk           (clk_core),
    .rstn          (rstn),
    .scan_enable   (scan_enable),
    .test_mode     (test_mode),
    // Control
    .i_start       (dma_start),
    .o_done        (dma_done),
    .i_addr        (dma_addr),
    .i_wdata       (dma_wdata),
    .o_rdata       (dma_rdata),
    // Memory interface
    .mem_cmd_valid (mem_cmd_valid),
    .mem_cmd_ready (mem_cmd_ready),
    .mem_addr      (mem_addr),
    .mem_rd_wrn    (mem_rd_wrn),
    .mem_be        (mem_be),
    .mem_data      (mem_data),
    .mem_data_valid(mem_data_valid),
    .mem_data_ready(mem_data_ready)
);

//------------------------------------------------------------------------------
// 3) On-Chip Cache Controller
cache_ctrl #(
    .CACHE_BYTES  (CACHE_SIZE),
    .LINE_BYTES   (CACHE_LINE_BE),
    .DATA_WIDTH   (DATA_WIDTH)
) u_cache_ctrl (
    .clk           (clk_core),
    .rstn          (rstn),
    .scan_enable   (scan_enable),
    .test_mode     (test_mode),
    // CPU / compute interface
    .i_req_valid   (dma_start),
    .i_req_addr    (dma_addr),
    .o_req_ready   (/* connect as needed */),
    .i_wr_data     (dma_wdata),
    .o_rd_data     (dma_rdata),
    // Memory interface (forwarded to DMA/mem_interface)
    .o_mem_cmd_valid(mem_cmd_valid),
    .i_mem_cmd_ready(mem_cmd_ready),
    .o_mem_addr     (mem_addr),
    .o_mem_rd_wrn   (mem_rd_wrn),
    .o_mem_be       (mem_be),
    .i_mem_data     (mem_data),
    .i_mem_data_valid(mem_data_valid),
    .o_mem_data_ready(mem_data_ready)
);

//------------------------------------------------------------------------------
// 4) Compute Engine (array of Transformer operator units)
generate
  genvar i;
  for (i = 0; i < NUM_CORES; i++) begin : gen_compute
    compute_engine #(
      .DATA_WIDTH   (DATA_WIDTH),
      .CACHE_LINE_BE(CACHE_LINE_BE)
    ) u_compute_engine (
      .clk           (clk_core),
      .rstn          (rstn),
      .scan_enable   (scan_enable),
      .test_mode     (test_mode),
      // Cache interface
      .i_cache_data  (/* connect as needed */),
      .o_cache_data  (/* connect as needed */),
      // Control & status
      .i_start       (dma_start),
      .o_done        (dma_done)
    );
  end
endgenerate

//------------------------------------------------------------------------------
// 5) On-Chip Interconnect / NoC
interconnect #(
    .NUM_MASTERS   (NUM_CORES),
    .NUM_SLAVES    (2)   // e.g., cache_controller + dma_engine
) u_interconnect (
    .clk           (clk_axi),
    .rstn          (rstn),
    .scan_enable   (scan_enable),
    .test_mode     (test_mode),
    // Master interfaces
    .m_addr        (/* connect from cores */),
    .m_data_w      (/* */),
    .m_data_r      (/* */),
    .m_valid       (/* */),
    .m_ready       (/* */),
    // Slave interfaces
    .s_addr        (/* to cache_ctrl and dma_engine */),
    .s_data_w      (/* */),
    .s_data_r      (/* */),
    .s_valid       (/* */),
    .s_ready       (/* */)
);

//------------------------------------------------------------------------------
// 6) PCIe / CXL Controller
pcie_ctrl u_pcie_ctrl (
    .clk           (clk_pcie),
    .rstn          (rstn),
    .scan_enable   (scan_enable),
    .test_mode     (test_mode),
    // PCIe PHY Interface
    .rx_data       (pcie_rx_data),
    .rx_valid      (pcie_rx_valid),
    .tx_data       (pcie_tx_data),
    .tx_valid      (pcie_tx_valid),
    .irq           (pcie_irq),
    // Memory mapped registers
    .reg_read_addr (cfg_axi_ar_addr),
    .reg_read_data (cfg_axi_r_data),
    .reg_read_valid(cfg_axi_r_valid),
    .reg_write_addr(cfg_axi_aw_addr),
    .reg_write_data(cfg_axi_w_data),
    .reg_write_valid(cfg_axi_w_valid),
    .reg_write_ready(cfg_axi_w_ready)
);

//------------------------------------------------------------------------------
// 7) Debug & DFT Interface
debug_if u_debug_if (
    .clk           (clk_core),
    .rstn          (rstn),
    .scan_enable   (scan_enable),
    .test_mode     (test_mode),
    .jtag_tck      (/* to pins */),
    .jtag_tms      (/* to pins */),
    .jtag_tdi      (/* to pins */),
    .jtag_tdo      (/* to pins */),
    .scan_chain_o  (/* chain out */)
);

endmodule : AcceleratorTop
