let i = 1;
let StrTmp = 'I2C' + i;
while (!(eval('typeof '+StrTmp+' === \'undefined\''))) {
  if (eval(StrTmp+' instanceof I2C')) {
    console.log (StrTmp + ' is an object!')
  }
  i++;
  StrTmp = 'I2C' + i;
}