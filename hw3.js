"use strict";
for(let i=1; i<=6; i+=1){ //用let宣告
    document.write('<table border="1">');
    document.write('<tr><td colspan="8">第'+String(i)+'張卡片 '//use String() is more strict
                    + '<input type="checkbox" name="ans">'
                    + '</td></tr>'
    );
    for(let j=0, m=2**(i-1); j<=31; j++){ //0~31: 5 bits, 先宣告m, 第i個表格就在第i位補0
        if((j%8)==0){
            document.write('<tr>');
        }
        document.write('<td>'+String(j*2+m-(j%m))); //補0變成5bits
        document.write('</td>');
        if((j%8)==7){
            document.write('</tr>');
        }
    }
    document.write('</table>');
}
//console.log(i);
