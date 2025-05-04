import { BrowserWindow } from "electron";
import fs from "fs";
import os from "os";

import si from "systeminformation";

import type { Systeminformation } from "systeminformation";
import { ipcWebContentsSend } from "./util.js";
// Define TypeScript interfaces for the data we care about

// interface ProcessUsage
//   extends Partial<Systeminformation.ProcessesProcessLoadData> {
//   pidd: number | string;
//   cpu: string | number;
//   memory: string;
//   memoryRaw: number;
//   name: string;
// }

interface ProcessUsage
  extends Partial<Systeminformation.ProcessesProcessLoadData> {
  memory: string;
  memoryRaw: number;
  cpuFormatted: string;
  name: string;
}

/*
 *
 * CPU
 */

// Get current CPU usage
export async function getCpuUsage(): Promise<CpuLoad | null> {
  try {
    const data = await si.currentLoad();
    return {
      currentLoad: Number(data.currentLoad.toFixed(1)),
      cpus: data.cpus.map((cpu) => ({
        load: Number(cpu.load.toFixed(1)),
      })),
    };
  } catch (error) {
    console.error(
      "Error fetching CPU load:",
      error instanceof Error ? error.message : error
    );
    return null;
  }
}

// Monitor CPU usage continuously
export function monitorCpuUsage(intervalMs: number = 2000): NodeJS.Timeout {
  return setInterval(async () => {
    try {
      const cpuData = await getCpuUsage();
      if (cpuData) {
        console.clear();
        console.log(`🖥️  CPU Usage: ${cpuData.currentLoad}%`);
        console.log(
          "Per Core:",
          cpuData.cpus.map((cpu) => `${cpu.load}%`)
        );
      }
    } catch (error) {
      console.error(
        "Monitoring error:",
        error instanceof Error ? error.message : error
      );
    }
  }, intervalMs);
}

// Process-specific CPU usage

export async function getProcessCpuUsage(
  pid: number | string
): Promise<ProcessUsage> {
  try {
    const data = await si.processLoad(pid.toString());

    return {
      pid: data[0].pid,
      cpuFormatted: data[0].cpu.toFixed(1), //  + "%"
      memory: (data[0].mem / 1024 / 1024).toFixed(2), //  + " MB"
      memoryRaw: data[0].mem,
      name: data[0].proc,
      mem: data[0].mem,
      pids: data[0].pids,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`[PID ${pid}] Failed to get process usage: ${message}`);
    throw error;
  }
}

/*
 *
 * Storage
 */
// Use the library's built-in
export function getStorageDate() {
  const stats = fs.statfsSync(process.platform === "win32" ? "c://" : "/");
  const total = stats.bsize * stats.blocks;
  const free = stats.bsize * stats.bfree;

  return {
    total: Math.floor(total / 1_000_000_000),
    usage: 1 - free / total,
  };
}

/*
 *
 * MEMORY
 */

// Corrected function with proper Promise handling
export async function getRamUsage(): Promise<Systeminformation.MemData> {
  try {
    const memData = await si.mem();
    return memData;
  } catch (error) {
    console.error(
      "Error fetching RAM usage:",
      error instanceof Error ? error.message : error
    );
    throw error; // Re-throw to allow error handling by caller
  }
}

//  Basic usage
export async function logMemoryUsage() {
  try {
    const memory = await getRamUsage();
    console.log(`
      Total RAM: ${(memory.total / 1024 / 1024 / 1024).toFixed(2)} GB
      Used RAM: ${(memory.used / 1024 / 1024 / 1024).toFixed(2)} GB
      Free RAM: ${(memory.free / 1024 / 1024 / 1024).toFixed(2)} GB
    `);
  } catch (error) {
    console.error("Failed to get memory usage:", error);
  }
}

//  Monitoring with interval
export function startMemoryMonitoring(intervalMs: number = 2000) {
  const interval = setInterval(async () => {
    try {
      const memory = await getRamUsage();
      console.clear();
      console.log(
        `Memory usage: ${Math.round((memory.used / memory.total) * 100)}%`
      );
    } catch (error) {
      console.error("Monitoring error:", error);
      clearInterval(interval);
    }
  }, intervalMs);

  return interval;
}

//  Integration with other system stats
export async function getSystemHealthReport() {
  try {
    const [memory, currentLoad, cpuTemp, diskLayout, networkStats] =
      await Promise.all([
        getRamUsage(),
        getCpuUsage() /* si.currentLoad() */,
        si.cpuTemperature(),
        si.diskLayout(),
        si.networkStats(),
      ]);
    const totalStorage = getStorageDate().total;
    const cpuModel = os.cpus()[0].model;

    return {
      memoryUsage: `${Math.round((memory.used / memory.total) * 100)}%`,
      cpuUsage: currentLoad,

      timestamp: new Date().toISOString(),
      totalStorage,
      cpuModel,
      cpuTemp,
      diskLayout,
      networkStats,
    };
  } catch (error) {
    console.error("System health check failed:", error);
    throw error;
  }
}

export function startSystemHealthMonitoring(intervalMs: number = 2000) {
  const interval = setInterval(async () => {
    try {
      const {
        memoryUsage,
        cpuUsage,
        timestamp,
        totalStorage,
        cpuModel,
        cpuTemp,
        diskLayout,
        networkStats,
      } = await getSystemHealthReport();

      // Get process-specific usage (using current PID as example)
      const processUsage = await getProcessCpuUsage(process.pid);

      console.clear();
      console.log(
        `
        ===== ${timestamp} =====
         Memory usage: ${memoryUsage}
         Total Storage: ${totalStorage}
         CPU Model: ${cpuModel}
         CPU usage: ${cpuUsage?.currentLoad}%
         [PID ${processUsage.pid}] Name: ${
          processUsage.name
        } CPU: ${processUsage.cpuFormatted.padEnd(6)}% | Memory: ${
          processUsage.memory
        }MB
        ===============================================================
        CPU Temp: ${cpuTemp.cores}
        Disk Layout: ${diskLayout[0].name}
        Network Stats: ${networkStats[0].rx_bytes}
        `
      );
      // if (processUsage !== null) {
      //   console.log(`Current process CPU: ${processUsage}%`);
      // }
    } catch (error) {
      console.error("Monitoring error:", error);
      clearInterval(interval);
    }
  }, intervalMs);

  return interval;
}

export function pollSystemHealthMonitoring(mainWindow: BrowserWindow) {
  const interval = setInterval(async () => {
    try {
      const {
        memoryUsage,
        cpuUsage,
        timestamp,
        totalStorage,
        cpuModel,
        cpuTemp,
        diskLayout,
        networkStats,
      } = await getSystemHealthReport();

      // Get process-specific usage (using current PID as example)
      // const processUsage = await getProcessCpuUsage(process.pid);

      const storageUsage = getStorageDate().usage;
      ipcWebContentsSend("statistics", mainWindow.webContents, {
        memoryUsage,
        cpuUsage,
        timestamp,
        totalStorage,
        cpuModel,
        cpuTemp,
        diskLayout,
        networkStats,

        storageUsage,
      });
    } catch (error) {
      console.error("Monitoring error:", error);
      clearInterval(interval);
    }
  }, 2000);

  return interval;
}

export function getStaticData() {
  const totalStorage = getStorageDate().total;
  const cpuModel = os.cpus()[0].model;

  return {
    timestamp: new Date().toISOString(),
    totalStorage,
    cpuModel,
  };
}
