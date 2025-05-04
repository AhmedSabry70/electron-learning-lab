type Statistics = {
  cpuUsage: CpuLoad | null;

  storageUsage: number;
  memoryUsage: string;
  timestamp: string;
  totalStorage: number | string;
  cpuModel: string;
  cpuTemp: unknown;
  diskLayout: unknown;
  networkStats: unknown;
};

type StaticData = {
  timestamp: string;
  totalStorage: number;
  cpuModel: string;
};

type EventPayloadMapping = {
  statistics: Statistics;
  getStaticData: StaticData;
};
interface CpuLoad {
  currentLoad: number;
  cpus: Array<{ load: number }>;
}

type UnsubscribeFunction = () => void;
interface Window {
  myAPI: {
    subscribeStatistics: (
      callback: (statistics: Statistics) => void
    ) => UnsubscribeFunction;
    getStaticData: () => Promise<StaticData>;
  };
}
