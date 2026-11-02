/* ===== PX: motor de sprites de Pixel (compartido por la mascota, la portada y la página del proyecto) ===== */
var PX=(function(){
  var C={k:'#1d1d1f',w:'#efece6',s:'#d3cdc3',o:'#f2541b',d:'#26262b',l:'#fbfbfa',b:'#f6b49a',z:'#a3a3a3'};
  var V={
    bloque:{map:["       oo       ","       kk       ","   kkkkkkkkkk   ","  kwwwwwwwwwwk  ","  kwwwwwwwwwwk  ","  kwwwwwwwwwwk  ","  kwwwwwwwwwwk  ","  kwwwwwwwwwwk  ","  kwwwwwwwwwwk  ","  kwwwwwwwwwwk  ","  kwwwwwwwwwwk  ","  kssssssssssk  ","   kkkkkkkkkk   ","    kk    kk    ","                ","                "],
      eyes:{L:[5,5],R:[9,5],w:2,h:2,c:'k',hl:true}, mouth:{x:7,y:9,w:2,c:'k'}, look:[1,1]},
    pantalla:{map:["                ","  kkkkkkkkkkkk  "," kwwwwwwwwwwwwk "," kwkkkkkkkkkkwk "," kwkddddddddkwk "," kwkddddddddkwk "," kwkddddddddkwk "," kwkddddddddkwk "," kwkddddddddkwk "," kwkddddddddkwk "," kwkkkkkkkkkkwk "," kwwwwwwwwwwowk ","  kkkkkkkkkkkk  ","      kkkk      ","    kkkkkkkk    ","                "],
      eyes:{L:[5,5],R:[9,5],w:2,h:2,c:'o',hl:false}, mouth:{x:7,y:9,w:2,c:'o'}, look:[1,1]},
    cursor:{map:[" k              "," kk             "," kok            "," kook           "," koook          "," kooook         "," koooook        "," koooooook      "," kooooooook     "," koooooooook    "," kooooookkkkk   "," koookoook      "," kook kooook    "," kok   koook    "," kk     kkk     ","                "],
      eyes:{L:[3,6],R:[5,6],w:1,h:2,c:'k',hl:false}, mouth:{x:4,y:10,w:1,c:'k'}, look:[1,0]}
  };
  /* Bocetos anteriores (con la cara ya dibujada en el mapa) */
  var SK={
    largo:[".........oo.........",".........kk.........",".....kkkkkkkkkk.....","....kwwwwwwwwwwk....","....kwwkkkkkkwwk....","....kwwkkookkwwk....","....kwwkkookkwwk....","....kwwkkkkkkwwk....","....kwwkkkkkkwwk....",".kk.kwwwwwwwwwwk....","kwwkkwwkwwwwkwwk....","kwwkkwwwkkkkwwwk....",".kk.kwwwwwwwwwwk....","....kswwwwwwwwsk....",".....kkkkkkkkkk.....","......kk....kk......"],
    cute:["........oo........","........kk........","....kkkkkkkkkk....","...kwwwwwwwwwwk...","..kwwwwkkkkwwwwk..","..kwwwwklokwwwwk..","..kwwwwkookwwwwk..","..kwwwwkkkkwwwwk..","..kwbbwwwwwwbbwk..","..kwwwwwkkwwwwwk..","...kwwwwwwwwwwk...","....kkkkkkkkkk....",".....kk....kk....."],
    cuadrado:["........oo........","........kk........","...kkkkkkkkkkkk...","..kwwwwwwwwwwwwk..","..kwwwwkkkkwwwwk..","..kwwwwklokwwwwk..","..kwwwwkookwwwwk..","..kwwwwkkkkwwwwk..","..kwwwwwwwwwwwwk..","..kwwwwwkkwwwwwk..","..kwwwwwwwwwwwwk..","...kkkkkkkkkkkk...",".....kk....kk....."]
  };
  var G=20, OFF=2;
  function blank(n,m){var g=[];for(var y=0;y<(m||n);y++)g.push(new Array(n).fill(null));return g}
  function put(g,x,y,c){x+=OFF;y+=OFF;if(x>=0&&y>=0&&x<G&&y<G)g[y][x]=c}
  function compose(f,vk){
    var v=V[vk||'bloque']; f=f||{}; var g=blank(G), m=v.map, dy=f.dy||0, lk=f.look||[0,0];
    for(var y=0;y<m.length;y++)for(var x=0;x<m[y].length;x++){var ch=m[y][x];if(ch!==' ')put(g,x,y+dy,ch)}
    var e=v.eyes, ex=Math.max(-v.look[0],Math.min(v.look[0],lk[0])), ey=Math.max(-v.look[1],Math.min(v.look[1],lk[1]));
    [e.L,e.R].forEach(function(p){
      var x0=p[0]+ex, y0=p[1]+ey+dy, st=f.eyes||'open';
      if(st==='open'||st==='wide'){var h=e.h+(st==='wide'?1:0), yy=y0-(st==='wide'?1:0);
        for(var j=0;j<h;j++)for(var i=0;i<e.w;i++)put(g,x0+i,yy+j,e.c); if(e.hl&&e.w>1)put(g,x0,yy,'l');}
      else if(st==='blink'){for(var i=0;i<e.w;i++)put(g,x0+i,y0+e.h-1,e.c)}
      else if(st==='happy'){for(var i=0;i<e.w;i++)put(g,x0+i,y0,e.c)}
    });
    var mo=v.mouth, mx=mo.x+ex, my=mo.y+dy, ms=f.mouth||'smile';
    if(ms==='smile'){for(var i=0;i<mo.w;i++)put(g,mx+i,my,mo.c);put(g,mx-1,my-1,mo.c);put(g,mx+mo.w,my-1,mo.c)}
    else if(ms==='flat'){for(var i=0;i<mo.w;i++)put(g,mx+i,my,mo.c)}
    else if(ms==='open'||ms==='o'){for(var i=0;i<mo.w;i++){put(g,mx+i,my-1,mo.c);put(g,mx+i,my,mo.c)}}
    (f.fx||[]).forEach(function(p){put(g,p[0],p[1],p[2]||'o')});
    return g;
  }
  function fromMap(rows){var g=rows.map(function(r){return r.split('').map(function(c){return (c==='.'||c===' ')?null:c})});return g}
  function outline(g){
    var h=g.length,w=g[0].length,o=g.map(function(r){return r.slice()});
    for(var y=0;y<h;y++)for(var x=0;x<w;x++){if(g[y][x])continue;
      if([[1,0],[-1,0],[0,1],[0,-1]].some(function(d){var yy=y+d[1],xx=x+d[0];return yy>=0&&xx>=0&&yy<h&&xx<w&&g[yy][xx]&&g[yy][xx]!=='z'}))o[y][x]='L';}
    return o;
  }
  function paint(ctx,g,scale,ox,oy){
    for(var y=0;y<g.length;y++)for(var x=0;x<g[y].length;x++){var ch=g[y][x];if(!ch)continue;ctx.fillStyle=ch==='L'?'#fbfbfa':C[ch];ctx.fillRect((ox||0)+x*scale,(oy||0)+y*scale,scale,scale)}
  }
  function draw(cv,g,scale,opt){
    opt=opt||{}; if(opt.dark)g=outline(g);
    cv.width=g[0].length*scale; cv.height=g.length*scale; var x=cv.getContext('2d'); x.imageSmoothingEnabled=false; x.clearRect(0,0,cv.width,cv.height);
    paint(x,g,scale,0,0);
  }
  var Z=function(t){return [[13,2-t,'z'],[14,2-t,'z'],[14,3-t,'z'],[13,4-t,'z'],[14,4-t,'z']]};
  var STATES={
    idle:{name:'Reposo',frames:[{d:600},{d:600,dy:-1}]},
    blink:{name:'Parpadeo',frames:[{d:1400},{d:120,eyes:'blink'},{d:220},{d:120,eyes:'blink'}]},
    look:{name:'Mira al cursor',frames:[{d:600,look:[1,0]},{d:600,look:[1,1]},{d:600,look:[-1,0]},{d:600,look:[0,-1]},{d:500}]},
    hello:{name:'Saludo',frames:[{d:200,eyes:'happy'},{d:140,eyes:'happy',dy:-2,fx:[[0,3],[15,2]]},{d:200,eyes:'happy'},{d:140,eyes:'happy',dy:-2,fx:[[0,2],[15,3]]},{d:900}]},
    talk:{name:'Hablando',frames:[{d:140,mouth:'open'},{d:140,mouth:'flat'},{d:140,mouth:'open'},{d:180,mouth:'smile'},{d:140,mouth:'open'},{d:500,mouth:'smile'}]},
    think:{name:'Pensando',frames:[{d:300,look:[1,-1],mouth:'flat',fx:[[14,1]]},{d:300,look:[1,-1],mouth:'flat',fx:[[14,1],[16,0]]},{d:500,look:[1,-1],mouth:'flat',fx:[[14,1],[16,0],[17,-1]]}]},
    happy:{name:'Contento',frames:[{d:300,eyes:'happy',fx:[[0,1],[15,0]]},{d:300,eyes:'happy',fx:[[-1,2],[16,1]]}]},
    sleep:{name:'Dormido',frames:[{d:700,eyes:'blink',mouth:'flat',fx:Z(0)},{d:700,eyes:'blink',mouth:'flat',dy:1,fx:Z(1)}]}
  };
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function loop(cv,frames,scale,opt,vk){var i=0,t;function tick(){var f=frames[i];draw(cv,compose(f,vk),scale,opt);if(reduce)return;i=(i+1)%frames.length;t=setTimeout(tick,f.d||400)}tick();return function(){clearTimeout(t)}}
  return {C:C,V:V,SK:SK,compose:compose,fromMap:fromMap,outline:outline,paint:paint,draw:draw,STATES:STATES,loop:loop,G:G,OFF:OFF};
})();
