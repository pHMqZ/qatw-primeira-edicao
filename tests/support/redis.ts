import { Queue, Job, QueueOptions, ConnectionOptions } from 'bullmq';

// Interface para configuração do Redis
interface RedisConfig {
  host: string;
  port: number;
  [key: string]: any; // para outras opções de conexão possíveis
}

// Interface para configuração da fila
interface QueueConfig {
  name: string;
  connection: RedisConfig;
}

// Configuração do Redis usando variáveis de ambiente
const redisConnection: RedisConfig = {
  host: 'paybank-redis',
  port: 6379
};

// Configuração da fila
const queueConfig: QueueConfig = {
  name: 'twoFactorQueue',
  connection: redisConnection
};

// Instância da fila com configuração tipada
const queue = new Queue(queueConfig.name, { 
  connection: queueConfig.connection 
});

export const getJob = async (): Promise<Job | null> => {
  try {
    const jobs = await queue.getJobs();
    //console.log(jobs[0].data.code);
    return jobs.length > 0 ? jobs[0].data.code : null;
  } catch (error) {
    console.error('Erro ao buscar jobs:', error);
    return null;
  }
};


export const clearJobs = async (): Promise<void> => {
  try {
    await queue.obliterate();
  } catch (error) {
    console.error('Erro ao limpar jobs:', error);
    throw error;
  }
};