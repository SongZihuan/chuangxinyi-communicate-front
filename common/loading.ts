import { nextTick } from 'vue';
import '~/theme/loading.scss';

export const NextLoading = {
	start: () => {
		const bodys = document.body;
		const div = document.createElement('div');
		div.setAttribute('class', 'loading-next');
		const htmls = `
			<div class="loading-next-box">
				<div class="loading-next-box-warp">
					<div class="loading-next-box-item"></div>
					<div class="loading-next-box-item"></div>
					<div class="loading-next-box-item"></div>
					<div class="loading-next-box-item"></div>
					<div class="loading-next-box-item"></div>
					<div class="loading-next-box-item"></div>
					<div class="loading-next-box-item"></div>
					<div class="loading-next-box-item"></div>
					<div class="loading-next-box-item"></div>
				</div>
			</div>
		`;
		div.innerHTML = htmls;
		bodys.insertBefore(div, bodys.childNodes[0]);
		window.nextLoading = true;
	},

  done: (time = 0) => {
    nextTick(() => {
      setTimeout(() => {
        window.nextLoading = false;
        const el = document.querySelector('.loading-next');
        el?.parentNode?.removeChild(el);
      }, time);
    });
  },
};
