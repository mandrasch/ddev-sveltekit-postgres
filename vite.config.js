import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

// show real URL to users:
if(process.env.IS_DDEV_PROJECT){
	const ddevUrl = `https://app.${process.env.DDEV_SITENAME}.${process.env.DDEV_TLD}`;
	console.log('Access the app via DDEV: '+ddevUrl);
}

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
