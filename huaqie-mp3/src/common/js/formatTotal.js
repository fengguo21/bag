class Total {
  changeAmount(number) {
    number = String(number).replace(/\,/g, "");
    if(isNaN(number) || number == "")return "";
    number = Math.round(number * 100) / 100;
      if (number < 0) {
        return '-' + this.outputdollars(Math.floor(Math.abs(number) - 0) + '') + this.outputcents(Math.abs(number) - 0);
      }else{
        return this.outputdollars(Math.floor(number - 0) + '') + this.outputcents(number - 0);
      }
        
  };
  //格式化金额
  outputdollars(number) {
    if (number.length <= 3)
      return (number == '' ? '0' : number);
    else {
      var mod = number.length % 3;
      var output = (mod == 0 ? '' : (number.substring(0, mod)));
      for (var i = 0; i < Math.floor(number.length / 3); i++) {
        if ((mod == 0) && (i == 0))
          output += number.substring(mod + 3 * i, mod + 3 * i + 3);
        else
          output += ',' + number.substring(mod + 3 * i, mod + 3 * i + 3);
      }
      return (output);
    }
  };
  // 小数
  outputcents(amount) {
    amount = Math.round(((amount) - Math.floor(amount)) * 100);
    return (amount < 10 ? '.0' + amount : '.' + amount);
  };
}

const total = new Total

export default total