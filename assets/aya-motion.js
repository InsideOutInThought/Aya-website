/* Aya motion layer: shared by every page. Pairs with aya-motion.css.
   Everything here is decorative. With reduced motion on, the roots and bridge
   are shown fully drawn and nothing moves. */
(function(){
  'use strict';
  var NS='http://www.w3.org/2000/svg';
  var still=!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  function svgEl(tag,attrs,parent){
    var e=document.createElementNS(NS,tag);
    for(var k in attrs) e.setAttribute(k,attrs[k]);
    if(parent) parent.appendChild(e);
    return e;
  }

  /* ---------- home hero: Dames Point Bridge, drawn in line ---------- */
  function bridge(hero){
    var s=svgEl('svg',{'class':'bridge',viewBox:'0 0 1200 200','aria-hidden':'true'});
    function deckY(x){var t=x/1200;return (1-t)*(1-t)*156+2*t*(1-t)*112+t*t*156;}
    function pa(d,delay,cls){
      var e=svgEl('path',{d:d,pathLength:1},s);
      if(cls) e.setAttribute('class',cls);
      e.style.setProperty('--d',delay+'s');
    }
    function ln(x1,y1,x2,y2,delay,cls){pa('M'+x1+' '+y1+'L'+x2+' '+y2,delay,cls);}
    pa('M0 156Q600 112 1200 156',0,'deck');
    pa('M0 163Q600 119 1200 163',.15);
    [400,800].forEach(function(T){
      ln(T-7.5,198,T-3.5,26,.35,'tower');
      ln(T+7.5,198,T+3.5,26,.35,'tower');
      ln(T-5,26,T+5,26,1.5);
      ln(T-6.6,172,T+6.6,172,1.3);
      ln(T-4.6,88,T+4.6,88,1.4);
      svgEl('circle',{cx:T,cy:17,r:3.4},s);
      for(var i=0;i<11;i++){
        [-1,1].forEach(function(side){
          var ty=36+i*8.6,dx=T+side*(192-i*17.5);
          ln(T+side*4.4,ty,dx,deckY(dx),1+i*.09,'cable');
        });
      }
    });
    [[452,188],[540,193],[628,187],[716,192],[250,190],[900,189]].forEach(function(p,i){
      pa('M'+p[0]+' '+p[1]+'q9 -4 18 0t18 0',1.9+i*.12);
    });
    /* live oaks with Spanish moss, standing in front of the approaches */
    function tree(cx,sc,seed,flip,delay){
      var sd=seed,R=function(){sd=(sd*9301+49297)%233280;return sd/233280;};
      var g=svgEl('g',{'class':flip?'tree-r':'tree-l'},s);
      function P(x,y){return (cx+(flip?-1:1)*x*sc).toFixed(1)+' '+(198-y*sc).toFixed(1);}
      function add(d,dl,cls){
        var e=svgEl('path',{d:d,pathLength:1,'class':cls},g);
        e.style.setProperty('--d',(delay+dl)+'s');
      }
      /* canopy: a wide, low dome of leaf masses */
      var n=10,pts=[],i;
      for(i=0;i<=n;i++){
        var a=Math.PI*(1.07-i/n*1.14),k=.93+R()*.12;
        pts.push([128*Math.cos(a)*k,62+58*Math.sin(a)*(.9+R()*.18)]);
      }
      var d='M'+P(pts[0][0],pts[0][1]);
      for(i=1;i<=n;i++){
        var mx=(pts[i-1][0]+pts[i][0])/2,my=(pts[i-1][1]+pts[i][1])/2-62;
        var l=Math.sqrt(mx*mx+my*my)||1,b=13+R()*9;
        d+=' Q'+P(mx+mx/l*b,my+62+my/l*b)+' '+P(pts[i][0],pts[i][1]);
      }
      d+=' Q'+P(96,46)+' '+P(70,57)+' Q'+P(40,49)+' '+P(8,58)+' Q'+P(-30,49)+' '+P(-64,57)+' Q'+P(-98,46)+' '+P(pts[0][0],pts[0][1])+'Z';
      var trunk='M'+P(-16,0)+' Q'+P(-8,18)+' '+P(-9,44)+' L'+P(9,44)+' Q'+P(8,18)+' '+P(17,0);
      add(d,0,'fill');add(trunk+'Z',0,'fill');
      add(trunk,.1,'limb');
      [[-104,66,-58,40],[-56,92,-34,58],[-4,104,-8,70],[50,95,34,60],[100,70,60,42],[-122,50,-66,34],[120,53,70,36]].forEach(function(q,j){
        add('M'+P(q[0]<0?-5:5,40)+' Q'+P(q[2],q[3])+' '+P(q[0],q[1]),.3+j*.08,'limb');
      });
      add(d,.6,'canopy');
      for(i=0;i<6;i++){
        var x=-88+i*35+R()*12,y=74+R()*24-Math.abs(x)*.12;
        add('M'+P(x-13,y)+' Q'+P(x,y+13)+' '+P(x+13,y),1.3+i*.07,'');
      }
      for(i=0;i<11;i++){
        var mxx=-112+i*22+R()*10,h=50+R()*7,len=13+R()*20;
        add('M'+P(mxx,h)+' Q'+P(mxx+3,h-len*.5)+' '+P(mxx-1,h-len),1.7+i*.06,'moss');
      }
      [-150,-96,-44,48,104,152].forEach(function(gx,j){
        add('M'+P(gx-5,0)+' Q'+P(gx-4,7)+' '+P(gx-8,12)+' M'+P(gx,0)+' L'+P(gx,14)+' M'+P(gx+5,0)+' Q'+P(gx+4,7)+' '+P(gx+9,11),1.9+j*.05,'');
      });
    }
    tree(150,1.18,41,false,2.1);
    tree(1062,1.04,97,true,2.4);
    /* wings */
    [[560,62,10],[602,46,12],[650,66,8],[700,40,7]].forEach(function(b,i){
      var x=b[0],y=b[1],w=b[2];
      pa('M'+(x-w)+' '+y+'Q'+(x-w/2)+' '+(y-w*.75)+' '+x+' '+y+'Q'+(x+w/2)+' '+(y-w*.75)+' '+(x+w)+' '+y,4+i*.25,'bird');
    });
    hero.insertBefore(s,hero.firstChild);
  }

  /* ---------- heroes: slow gold motes ---------- */
  function motes(hero){
    if(still) return;
    var c=document.createElement('canvas');
    if(!c.getContext) return;
    c.className='motes';c.setAttribute('aria-hidden','true');
    hero.insertBefore(c,hero.firstChild);
    var rich=hero.classList.contains('home');
    var ctx=c.getContext('2d'),W=0,H=0,ms=[],gl=[],on=true,raf=0,last=0;
    function make(anywhere){
      return {x:Math.random()*W,y:anywhere?Math.random()*H:H+12,r:.8+Math.random()*2.2,
        vy:6+Math.random()*16,sway:8+Math.random()*26,ph:Math.random()*6.28,
        tw:.4+Math.random()*1,a:.3+Math.random()*.6};
    }
    /* glints: four-point sparkles that bloom and fade in place */
    function glint(t0){
      return {x:Math.random()*W,y:Math.random()*H,t0:t0,dur:1400+Math.random()*2200,s:5+Math.random()*9};
    }
    function drawGlint(q,t){
      var life=(t-q.t0)/q.dur;
      if(life>=1){var nq=glint(t+Math.random()*900);q.x=nq.x;q.y=nq.y;q.t0=nq.t0;q.dur=nq.dur;q.s=nq.s;return;}
      if(life<=0) return;
      var a=Math.pow(Math.sin(Math.PI*life),2),L=q.s*(.5+a*.7);
      var g=ctx.createRadialGradient(q.x,q.y,0,q.x,q.y,L);
      g.addColorStop(0,'rgba(255,248,220,'+a+')');g.addColorStop(.25,'rgba(246,209,121,'+a*.4+')');g.addColorStop(1,'rgba(246,209,121,0)');
      ctx.fillStyle=g;ctx.beginPath();ctx.arc(q.x,q.y,L,0,6.2832);ctx.fill();
      ctx.strokeStyle='rgba(255,244,205,'+a*.9+')';ctx.lineWidth=1;ctx.lineCap='round';
      ctx.beginPath();ctx.moveTo(q.x-L*1.5,q.y);ctx.lineTo(q.x+L*1.5,q.y);ctx.moveTo(q.x,q.y-L*1.5);ctx.lineTo(q.x,q.y+L*1.5);ctx.stroke();
    }
    function size(){
      var dpr=Math.min(window.devicePixelRatio||1,2);
      W=c.clientWidth;H=c.clientHeight;
      c.width=W*dpr;c.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
      var n=Math.round(Math.min(72,Math.max(26,W/20))*(rich?1.7:1));
      ms=[];for(var i=0;i<n;i++) ms.push(make(true));
      gl=[];
      if(rich){var g=Math.round(Math.min(30,Math.max(14,W/50)));for(i=0;i<g;i++) gl.push(glint(performance.now()-Math.random()*3000));}
    }
    function frame(t){
      raf=0;
      var dt=Math.min(.05,(t-last)/1000||0);last=t;
      ctx.clearRect(0,0,W,H);
      for(var i=0;i<ms.length;i++){
        var m=ms[i];
        m.y-=m.vy*dt;m.ph+=dt*.5;
        if(m.y<-14) ms[i]=m=make(false);
        var x=m.x+Math.sin(m.ph)*m.sway;
        var a=m.a*(.5+.5*Math.sin(t/1000*m.tw+m.ph*3))*Math.min(1,m.y/90);
        if(a<=0) continue;
        var g=ctx.createRadialGradient(x,m.y,0,x,m.y,m.r*5);
        g.addColorStop(0,'rgba(255,241,194,'+a+')');
        g.addColorStop(.3,'rgba(246,209,121,'+a*.5+')');
        g.addColorStop(1,'rgba(246,209,121,0)');
        ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,m.y,m.r*5,0,6.2832);ctx.fill();
      }
      for(var j=0;j<gl.length;j++) drawGlint(gl[j],t);
      if(on) raf=requestAnimationFrame(frame);
    }
    function go(){if(on&&!raf){last=performance.now();raf=requestAnimationFrame(frame);}}
    size();go();
    var rt;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(size,200);});
    var seen=true;
    if('IntersectionObserver' in window){
      new IntersectionObserver(function(es){seen=es[0].isIntersecting;on=seen&&!document.hidden;go();}).observe(c);
    }
    document.addEventListener('visibilitychange',function(){on=seen&&!document.hidden;go();});
  }

  /* ---------- statement bands: words rise in order, then the gold line lands ---------- */
  function stage(sec){
    if(still||!('IntersectionObserver' in window)) return;
    var ps=sec.querySelectorAll(sec.classList.contains('buyband')?'p.big':'p');
    if(ps.length<2) return;
    var d=0;
    function wrap(p,cls,step,parts){
      p.setAttribute('aria-label',p.textContent.replace(/\s+/g,' ').trim());
      p.textContent='';
      parts.forEach(function(t,i){
        var s=document.createElement('span');
        s.className=cls;s.textContent=t;s.setAttribute('aria-hidden','true');
        s.style.transitionDelay=d+'ms';
        if(cls==='beat') s.style.animationDelay=(d+250)+'ms';
        p.appendChild(s);
        if(i<parts.length-1) p.appendChild(document.createTextNode(' '));
        d+=step;
      });
    }
    var t0=ps[0].textContent.replace(/\s+/g,' ').trim();
    var t1=ps[1].textContent.replace(/\s+/g,' ').trim();
    wrap(ps[0],'w',55,t0.split(' '));
    d+=450;
    wrap(ps[1],'beat',850,t1.match(/[^.!?]+[.!?]+/g)||[t1]);
    sec.classList.add('staged');
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){sec.classList.add('lit');io.disconnect();}});},{threshold:.45});
    io.observe(sec);
  }

  /* ---------- travelling roots ----------
     A gold root runs along the foot of the hero, turns down both page margins
     as a braided pair, sends fiddlehead tendrils along the section seams, and
     the two sides meet at the footer. It draws as the reader scrolls. */
  function roots(main,hero){
    var svg=svgEl('svg',{'class':'rootline','aria-hidden':'true'},main);
    var strands=[],extras=[],knot=null,best=0,W=0,H=0,raf=0;
    function rnd(seed){var s=seed;return function(){s=(s*9301+49297)%233280;return s/233280;};}
    function addStrand(d,cls,withTip){
      var p=svgEl('path',{d:d,'class':cls},svg),L=p.getTotalLength(),N=Math.ceil(L/12),map=[];
      for(var i=0;i<=N;i++) map.push(p.getPointAtLength(L*i/N).y);
      p.style.strokeDasharray=L;p.style.strokeDashoffset=L;
      var s={p:p,L:L,N:N,map:map,cur:0,tgt:0,tip:null};
      strands.push(s);
      return s;
    }
    function addExtra(d,cls,y){
      var p=svgEl('path',{d:d,'class':cls},svg),l=p.getTotalLength();
      p.style.strokeDasharray=l;p.style.strokeDashoffset=l;
      extras.push({p:p,y:y,on:false});
    }
    function build(){
      W=main.clientWidth;H=main.offsetHeight;
      svg.setAttribute('viewBox','0 0 '+W+' '+H);
      while(svg.firstChild) svg.removeChild(svg.firstChild);
      strands=[];extras=[];
      var top=main.getBoundingClientRect().top;
      var hb=hero.getBoundingClientRect().bottom-top;
      var edge=W>1120?(W-1120)/2+24:24;            /* where the text column starts */
      var gx=edge-Math.min(edge/2,66);             /* the roots live in the margin */
      var amp=Math.min(gx*.55,20);
      var r=Math.min(44,gx*1.3);
      var twigLen=Math.max(7,Math.min(gx-4,52));
      var ys=hb-3,yEnd=H-60,cx=W/2;
      var seams=[];
      Array.prototype.forEach.call(main.children,function(c){
        if(c===svg||c===hero) return;
        var t=c.getBoundingClientRect().top-top;
        if(t>hb+140&&t<yEnd-140) seams.push(t);   /* skips the marks strip under the hero */
      });
      var tLen=Math.max(96,Math.min(W*.3,280));
      [1,-1].forEach(function(dir,si){
        var R=rnd(si?77:31);
        var X=function(x){return dir>0?x:W-x;};
        var nodes=[],y=ys+r,sign=si?-1:1;
        while(y<yEnd-170){
          y=Math.min(y+150+R()*110,yEnd-30);
          nodes.push({y:y,o:sign*amp*(.6+R()*.4)});
          sign=-sign;
        }
        function strand(k,full){
          var x=gx,py=ys+r,d;
          if(full) d='M'+cx+' '+ys+' L'+X(gx+r)+' '+ys+' Q'+X(gx)+' '+ys+' '+X(gx)+' '+(ys+r);
          else d='M'+X(gx)+' '+(ys+r);
          nodes.forEach(function(n){
            var nx=gx+k*n.o,h=(n.y-py)*.45;
            d+=' C'+X(x)+' '+(py+h)+' '+X(nx)+' '+(n.y-h)+' '+X(nx)+' '+n.y;
            x=nx;py=n.y;
          });
          var h2=(yEnd-py)*.45;
          d+=' C'+X(x)+' '+(py+h2)+' '+X(gx)+' '+(yEnd-h2)+' '+X(gx)+' '+yEnd;
          if(full) d+=' C'+X(gx)+' '+(H-4)+' '+cx+' '+(yEnd+6)+' '+cx+' '+H;
          return addStrand(d,full?'trunk':'trunk thin');
        }
        strand(-1,false);
        var a=strand(1,true);
        a.tip=svgEl('circle',{'class':'tip',r:3.6},svg);
        /* rootlets */
        var py=ys+r;
        nodes.forEach(function(n){
          if(R()>.22){
            var out=R()>.3?-1:1,len=twigLen*(.6+R()*.4)*(out>0?.45:1),ty=py+(n.y-py)*(.25+R()*.5);
            addExtra('M'+X(gx)+' '+ty+' q'+(dir*out*len*.55)+' '+(len*.15)+' '+(dir*out*len)+' '+(len*.8+R()*10),'twig',ty);
          }
          py=n.y;
        });
        /* fiddlehead tendrils along the section seams, alternating sides */
        seams.forEach(function(yS,i){
          if((i%2===0)!==(dir>0)) return;
          var ex=gx+tLen,Rr=Math.min(15,tLen*.085);
          var d='M'+X(gx)+' '+(yS-46)+' C'+X(gx+2)+' '+(yS-8)+' '+X(gx+tLen*.3)+' '+(yS+7)+' '+X(gx+tLen*.6)+' '+(yS+2)+
                ' S'+X(ex-tLen*.12)+' '+yS+' '+X(ex)+' '+yS;
          var turns=3.3*Math.PI,cyy=yS-Rr;
          for(var th=.25;th<=turns;th+=.25){
            var rr=Rr*(1-th/(turns*1.08)),a2=Math.PI/2-th;
            d+=' L'+X(ex+rr*Math.cos(a2)).toFixed(1)+' '+(cyy+rr*Math.sin(a2)).toFixed(1);
          }
          addExtra(d,'tendril',yS-40);
        });
      });
      knot=svgEl('circle',{'class':'knot',cx:cx,cy:H,r:5},svg);
    }
    function lenAtY(s,y){
      var i=0;while(i<s.N&&s.map[i+1]<=y) i++;
      if(i>=s.N) return s.L;
      var a=s.map[i],b=s.map[i+1],f=b>a?(y-a)/(b-a):0;
      return s.L*(i+Math.max(0,Math.min(1,f)))/s.N;
    }
    function target(snap){
      var top=main.getBoundingClientRect().top,vh=window.innerHeight;
      var y=still?H+1:-top+vh*.74;
      if(-top+vh>=H-4) y=H+1;
      best=Math.max(best,y);
      strands.forEach(function(s){s.tgt=lenAtY(s,best);});
      extras.forEach(function(t){
        if(!t.on&&best>t.y+8){t.on=true;if(snap) t.p.style.transition='none';t.p.classList.add('on');t.p.style.strokeDashoffset=0;}
      });
    }
    function paint(snap){
      var moving=false,done=best>=H;
      strands.forEach(function(s){
        var gap=s.tgt-s.cur;
        if(snap||still||Math.abs(gap)<.6) s.cur=s.tgt; else {s.cur+=gap*.14;moving=true;}
        s.p.style.strokeDashoffset=s.L-s.cur;
        if(s.tip){
          if(s.cur>2&&s.cur<s.L-1&&!still){
            var pt=s.p.getPointAtLength(s.cur);
            s.tip.setAttribute('cx',pt.x);s.tip.setAttribute('cy',pt.y);s.tip.classList.add('on');
          } else s.tip.classList.remove('on');
        }
      });
      if(knot&&done&&!moving) knot.classList.add('on');
      return moving;
    }
    function loop(){raf=0;if(paint(false)) raf=requestAnimationFrame(loop);}
    function kick(){target();if(!raf) raf=requestAnimationFrame(loop);}
    function rebuild(){
      if(main.clientWidth===W&&main.offsetHeight===H) return;   /* e.g. a phone's address bar sliding away */
      build();target(true);paint(true);
    }
    window.addEventListener('scroll',kick,{passive:true});
    var rt;function later(){clearTimeout(rt);rt=setTimeout(rebuild,160);}
    window.addEventListener('resize',later);
    window.addEventListener('load',later);
    if(document.fonts&&document.fonts.ready) document.fonts.ready.then(later);
    if('ResizeObserver' in window) new ResizeObserver(later).observe(main);
    build();kick();
  }

  function init(){
    var main=document.querySelector('main');
    var heroes=document.querySelectorAll('.hero');
    var home=document.querySelector('.hero.home');
    if(home) bridge(home);
    Array.prototype.forEach.call(heroes,motes);
    Array.prototype.forEach.call(document.querySelectorAll('.statement,.buyband'),stage);
    var hero=main&&main.querySelector('.hero');
    if(main&&hero) roots(main,hero);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
