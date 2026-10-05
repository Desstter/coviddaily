import {defineConfig,loadEnv,transformWithEsbuild} from 'vite';
import vue from '@vitejs/plugin-vue';
export default defineConfig(({mode})=>{
 const env=loadEnv(mode,process.cwd(),'REACT_APP_');
 return {
plugins:[vue()],
 base:'/',
 build:{outDir:'dist'},
 define:{'process.env.REACT_APP_API_URL':JSON.stringify(env.REACT_APP_API_URL||'')},
 };
});
