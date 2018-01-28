import 'pixi.js';
import { TimelineMax } from 'gsap';
let width = $(window).width();
let height = $(window).height();

export default class Canvas {
  constructor() {
  	let that = this;
    this.renderer = PIXI.autoDetectRenderer(
      $(window).width(),
      $(window).height(),
      { antialias: true }
    );
    document.body.appendChild(this.renderer.view);

    this.loader = PIXI.loader;
    this.currentIndex = 1;
    this.dir = 1;

    // create the root of the scene graph
    this.stage = new PIXI.Container();

    this.container = new PIXI.Container();
    this.container2 = new PIXI.Container();
    this.container.position.x = this.renderer.width / 2;
    this.container2.position.x = this.renderer.width / 2;
    this.container.position.y = this.renderer.height / 2;
    this.container2.position.y = this.renderer.height / 2;

    // let bg,bgFront,thing,thing2;
    this.textures = [];
    this.loader
      .add('a', 'img/1.jpg')
      .add('b', 'img/2.jpg')
      .add('c', 'img/3.jpg')
      .add('d', 'img/4.jpg');


    this.loader.load((loader, resources) => {


      Object.keys(resources).forEach(function(key,index) {
        that.textures.push(resources[key].texture);
        
      });
      // OLD IMAGE
      console.log(this.textures);
   

      this.current = new PIXI.Sprite(this.textures[0]);
      this.current.anchor.x = 0.5;
      this.current.anchor.y = 0.5;

      let winprop = $(window).width() / $(window).height();
      let imageprop = this.current.width / this.current.height;

      if (winprop > imageprop) {
        this.current.width = $(window).width();
        this.current.height = $(window).width() / imageprop;
      } else {
        this.current.height = $(window).height();
        this.current.width = $(window).height() * imageprop;
      }

      this.current.anchor.x = 0.5;
      this.current.anchor.y = 0.5;

      // NEW IMAGE
      this.next = new PIXI.Sprite(this.textures[1]);
      imageprop = this.next.width / this.next.height;

      if (winprop > imageprop) {
        this.next.width = $(window).width();
        this.next.height = $(window).width() / imageprop;
      } else {
        this.next.height = $(window).height();
        this.next.width = $(window).height() * imageprop;
      }

      this.next.anchor.x = 0.5;
      this.next.anchor.y = 0.5;

      this.container.addChild(this.next);
      this.container2.addChild(this.current);
      this.stage.addChild(this.container);
      this.stage.addChild(this.container2);

      // mask
      this.thing = new PIXI.Graphics();
      this.stage.addChild(this.thing);
      this.thing.position.x = 0;
      this.thing.position.y = 0;
      this.thing.lineStyle(0);

      this.thing2 = new PIXI.Graphics();
      this.stage.addChild(this.thing2);
      this.thing2.position.x = 0;
      this.thing2.position.y = 0;
      this.thing2.lineStyle(0);

      this.thing2.beginFill(0x8bc5ff, 0.4);
      this.thing2.moveTo(0, 0);
      this.thing2.lineTo(0, height);
      this.thing2.lineTo(width, height);
      this.thing2.lineTo(width, 0);

      this.container.mask = this.thing;
      this.container2.mask = this.thing2;

      this.renderer.render(this.stage);
    });

  }
  fromto(from, to, fromDOM,toDOM) {
    // up or down
    toDOM.show();
    let dir = 1;
    if(from>to) {dir = -1;};
    dir *= -1;
    this.dir = dir;

    let that = this;

    this.current.texture = this.textures[from-1];
    this.next.texture = this.textures[to-1];
    console.log(from-1,to-1);
    this.currentIndex = to;

    let obj = {a: dir>0?0:1};
    let tl = new TimelineMax({onComplete: function() {
    	that.current.position.y -= 100*that.dir; 
    	fromDOM.hide();
    }});

    this.next.position.y -= 100*that.dir;
    
    tl.to(obj,1.2,{a:dir>0?1:0,ease: Power3.easeOut,onUpdate:function() {
    	that.thing.clear();
    	that.thing2.clear();
    	let one, two, rect,rect2;
    	if(dir>0) {
    		one = obj.a*obj.a;
    		two = obj.a;
    	} else{
    		one = obj.a;
    		two = obj.a*obj.a;

    	}
    	
    	


    	let three = (one + two)/2;

    	if(dir>0) {
    		that.thing.beginFill(0x8bc5ff, 0.4);
    		that.thing.moveTo(0, 0);
    		that.thing.lineTo(0,height*one);
    		that.thing.lineTo(width,height*two);
    		that.thing.lineTo(width,0);

    		that.thing2.beginFill(0x8bc5ff, 0.4);
    		that.thing2.moveTo(0,height);
    		that.thing2.lineTo(0,height*one);
    		that.thing2.lineTo(width,height*two);
    		that.thing2.lineTo(width,height);

    		rect2 = 'rect('+0+'px,'+width+'px,'+(height*three)+'px,0)';
    		rect = 'rect('+height*three+'px,'+width+'px,'+(height)+'px,0)';
    	} else{
    		that.thing.beginFill(0x8bc5ff, 0.4);
    		that.thing.moveTo(0, height);
    		that.thing.lineTo(0,height*one);
    		that.thing.lineTo(width,height*two);
    		that.thing.lineTo(width,height);

    		that.thing2.beginFill(0x8bc5ff, 0.4);
    		that.thing2.moveTo(0,0);
    		that.thing2.lineTo(0,height*one);
    		that.thing2.lineTo(width,height*two);
    		that.thing2.lineTo(width,0);

    		rect2 = 'rect('+height*three+'px,'+width+'px,'+(height)+'px,0)';
    		rect = 'rect('+0+'px,'+width+'px,'+(height*three)+'px,0)';
    	}
    	

    	
    	fromDOM.css('clip',rect);
    	toDOM.css('clip',rect2);

    	that.renderer.render(that.stage);
    }})
      .to(that.current.position,1.2,{y: dir>0?'+=100':'-=100'},0)
      .to(that.next.position,1.2,{y: dir>0?'+=100':'-=100'},0)
      .fromTo(fromDOM.find('h2'),1.2,{y: 0,opacity: 1},{y: 50*dir,opacity: 0},0)
      .fromTo(toDOM.find('h2'),1.2,{y: -50*dir,opacity: 0},{y: 0,opacity: 1},0);
    // .fromTo(toDOM.find('h2'),1.2,{y: -50*dir,opacity: 0},{y: 0,opacity: 1},0);
  }
  reset(dir) {
  	
  }
}
