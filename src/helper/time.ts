export function ConvertSecondToTime(second: number) {
	const hour = Math.floor(second / (60 * 60));
	const minute = Math.floor((second - hour * 60 * 60) / 60);
	const secondRemaining = Math.floor(second - hour * 60 * 60 - minute * 60);
	return `${hour > 9 ? hour : '0' + hour}:${minute > 9 ? minute : '0' + minute}:${
		secondRemaining > 9 ? secondRemaining : '0' + secondRemaining
	}`;
}
