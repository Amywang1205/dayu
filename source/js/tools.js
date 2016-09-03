
function toTwo(n){
	return n < 10 ? '0' + n : '' + n;
}
function setTime(arr){
	return toTwo(arr[0]) + '年' + toTwo(arr[1]) + '月' + toTwo(arr[2]) + '日';
}