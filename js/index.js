"use strict";



class Player extends NodeScript
{
    constructor()
    {
        super("player");
       
    }
    ready()
    {
        console.log("Player");
        this.spriteEyes = new Sprite(4);
        this.animation = new Animator(this.spriteEyes);
        this.animation.AddAnimation("idle",[4,5,6,7,8,9,10,11,12,13,14,15],6);
        this.animation.SetAnimation("idle");
        this.animation.SetFrame(3);

        this.nodeHead = new Node();
        this.nodeHead.x=-25;
        this.nodeHead.y=-15;

        this.nodeHead.Add(this.spriteEyes);
        this.nodeHead.Add(this.animation);

 
        this.Add(this.nodeHead);
       // this.Add(this.animation);
      
    }
    render (context)
    {
       
    }

    update(dt)
    {   

        let gravity = new Vector2(0, 0.1);
        this.parent.ApplyForce(gravity);

        let friction = this.parent.velocity.get();
        friction.mult(-1);
        friction.normalize();
        friction.mult(0.01);
        this.parent.ApplyForce(friction);

        let velocity = this.parent.velocity.magnitude();
        if (velocity > 5.0 && velocity < 10.5)
        {
            this.animation.SetFrame(1);
        }else
        if (velocity > 10.5)
        {
            this.animation.SetFrame(3);
        }
        else
        {
            this.animation.SetFrame(0);
        }
      //  console.log(velocity);
  

        if (IsMouseButtonDown(0))
        {
            let x = GetMouseX();
            let y = GetMouseY();
            let mouse = new Vector2(x, y);
            let dir = mouse.subtract(new Vector2(this.parent.x, this.parent.y));
            dir.normalize();
            dir.mult(0.005);
            this.parent.ApplyForce(dir);
        }

        this.parent.SetClipBoud(new Bound(0,0,SCREEN_WIDTH,SCREEN_HEIGHT));



    }
    
  

}

class MainScene extends Scene 
{

    ready()
    {
        console.log("MAIN");
        

        let backNode = new Node();
        backNode.Add(new Sprite(16));
        backNode.scaleX=1.5;
        backNode.scaleY=0.8;
        this.Add(backNode);

        let node = new Actor("player",1);
        let nodeShape = new Node();
        nodeShape.Add(new Sprite(3));
        node.Add(nodeShape);

        node.Add(new Player());

       


        
 
        
   

    // //     let spriteEyes = new Sprite(4);
    // //     let animation = new Animator(spriteEyes);
    // //     animation.AddAnimation("idle",[4,5,6,7,8,9,10,11,12,13,14,15],6);
    // //     animation.SetAnimation("idle");
    // //     animation.SetFrame(0);
    // //    // nodeShape.Add(animation);

    // //     node.Add(animation);
    // //     node.Add(spriteEyes);
   
        nodeShape.x=-40;
        nodeShape.y=-40;

        
        
        node.x=100;
        node.y=100;
        // node.pivotX=40;
        // node.pivotY=40;
        node.scaleX=0.5;
        node.scaleY=0.5;
        
        this.Add(node);
      
    }
   

    render(context)
    {
       
        context.fillStyle = "red";
        context.fillRect(0,SCREEN_HEIGHT-20, SCREEN_WIDTH, 2);
    }
    update(dt)
    {

    }
    
    mouse_down(x,y,button)
    {
        
       
    }
    mouse_up(x,y,button)
    {
         
    }
}



const imageSources = 
[
    'assets/misc/rollingBall_sheet.png',//0
    'assets/actors/red_body_squircle.png',//1
    'assets/actors/blue_body_squircle.png',//2
    'assets/actors/green_body_squircle.png',//3

    'assets/actors/face_a.png',//4
    'assets/actors/face_b.png',
    'assets/actors/face_c.png',
    'assets/actors/face_d.png',
    'assets/actors/face_e.png',
    'assets/actors/face_f.png',
    'assets/actors/face_g.png',
    'assets/actors/face_h.png',
    'assets/actors/face_i.png',
    'assets/actors/face_j.png',
    'assets/actors/face_k.png',
    'assets/actors/face_l.png',//15

    'assets/Backgrounds/backgroundEmpty.png',//16
    
       
];

let width = window.innerWidth;
let height = window.innerHeight;

Game.Init(true,width, height, true);
Game.AddScene("main", new MainScene());
Game.SetCurrentScene("main");
Game.LoadImages(imageSources,1).then(() => 
{
    console.log('Todas as imagens foram carregadas. Iniciando o jogo.');
    Game.Start();
});


