"use strict";
for(let i=1; i<=6; i+=1){
    document.write('<table border="1">');
    document.write('<tr><td colspan="8">第'+String(i)+'張卡片'//use String() is more strict
                    + '<input type="checkbox">'
                    + '</td></tr>'
    );
    for(let j=0, m=2**(i-1); j<=31; j++){ //0~31: 5 bits, 先宣告m
        if((j%8)==0){ //j==1 || j==9 || j==17 || j==25
            document.write('<tr>');
        }
        document.write('<td>'+String(j*2+m-(j%m)));
        document.write('</td>');
        if((j%8)==7){ //j==8 || j==16 || j==24 || j==32
            document.write('</tr>');
        }
    }
    /*document.write('<td>');
    document.write('</td>');
    document.write('</tr>');*/
    document.write('</table>');
}
//console.log(i);
