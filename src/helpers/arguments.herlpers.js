import minimist from 'minimist';

const args = minimist(process.argv.slice(2), {
  default: {
    mode: 'dev',
  },
});

export default args;
