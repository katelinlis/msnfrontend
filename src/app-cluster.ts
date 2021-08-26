import * as cluster from 'cluster';
import { Cluster } from 'cluster';
import * as os from 'os';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ClusterService {
  cluster: any;
  constructor() {
    this.cluster = cluster;
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  public register(workers: number, callback: Function): void {
    if (this.cluster.isMaster) {
      console.log(`Master server started on ${process.pid}`);
      this.SIGINT();
      this.Cluster(callback);

      const cpus = os.cpus().length;
      if (workers > cpus) workers = cpus;

      for (let i = 0; i < workers; i++) {
        this.cluster.fork();
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  private Cluster(callback: Function) {
    this.cluster.on('online', function (worker) {
      console.log('Worker %s is online', worker.process.pid);
    });
    this.cluster.on('exit', (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} died. Restarting`);
      this.cluster.fork();
    });
    callback();
  }
  private SIGINT() {
    //ensure workers exit cleanly
    process.on('SIGINT', function () {
      console.log('Cluster shutting down...');
      for (const id in this.cluster.workers) {
        this.cluster.workers[id].kill();
      }
      // exit the master process
      process.exit(0);
    });
  }
}
