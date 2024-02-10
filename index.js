"use strict";



class Player extends NodeScript
{
    constructor(mass,gravitiy,coeficiente)
    {
        super("player");
        this.gravitiy = gravitiy;
        this.coeficiente = coeficiente;
        this.mass = mass;
        this.water = new Bound(0,SCREEN_HEIGHT-250,SCREEN_WIDTH,SCREEN_HEIGHT-50);
        this.OnWater = false;
     
    
       
    }

    calculateDrag() 
    {
        // Magnitude is coefficient * speed squared
        let speed = this.parent.velocity.magnitude();
        let dragMagnitude = this.coeficiente * speed * speed;
    
        // Direction is inverse of velocity
        let dragForce = new Vector2(-this.parent.velocity.x, -this.parent.velocity.y);
        
    
        // Scale according to magnitude
        let dragForceMagnitude = Math.sqrt(dragForce.x * dragForce.x + dragForce.y * dragForce.y);
            dragForce.x /= dragForceMagnitude;
            dragForce.y /= dragForceMagnitude;
            dragForce.x *= dragMagnitude;
            dragForce.y *= dragMagnitude;

        return dragForce;
      }

    ready()
    {
        console.log("Player");
        this.radius = 40 + this.parent.scaleX* this.mass;
        this.spriteEyes = new Sprite(4);
        this.animation = new Animator(this.spriteEyes);

        let a = Array.from({ length: 16 }, (_, i) => i);

        this.animation.AddAnimation("idle",[3,4,5,6,7,8,9,10,11,12,13,14,15],6);
        this.animation.SetAnimation("idle");
        this.animation.SetFrame(3);

        this.nodeHead = new Node();
        this.nodeHead.x=-25 * this.parent.scaleX;
        this.nodeHead.y=-15 * this.parent.scaleY;

        let body = new Sprite(0);

      //  this.nodeHead.Add(body);
        
        this.nodeHead.Add(this.spriteEyes);
        this.nodeHead.Add(this.animation);

 
        this.Add(this.nodeHead);

      
    }
    render (context)
    {
       Game.Circle(0,0,this.radius);
    }

    update(dt)
    {   

        this.OnWater = this.parent.y> this.water.y;
        if (this.OnWater)
        {
            let dragForce = this.calculateDrag(this.coeficiente);
            this.parent.ApplyForce(dragForce);
          
        }
        let gravityForce = new Vector2(0, this.gravitiy * this.mass);
        this.parent.ApplyForce(gravityForce);
      


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

        let ground = (this.water.y+200);
        if (this.parent.y > ground-this.radius)
        {
            this.parent.velocity.y *= -0.9;
            this.parent.y = ground - this.radius;
           
           
        }



    }
    
  

}

class MainScene extends Scene 
{

    gravitiy = 0.1;
    coeficiente = 0.1;
    

    ready()
    {
        console.log("MAIN");
        

        let backNode = new Node("background");
        backNode.Add(new ScrollBackground(15,0.5,0,true,true));
        this.Add(backNode);


        let window = new Window("Opções",Game.width-300,100,200,250);
       

        this.massas=[];
        let mass_min = 2;
        let mass_max = 6;
        this.massas.push(randomFloat(mass_min,mass_max));
        this.massas.push(randomFloat(mass_min,mass_max));
        this.massas.push(randomFloat(mass_min,mass_max));
        this.massas.push(randomFloat(mass_min,mass_max));


       // window.addSlider(25,10,20,100,0,10,1,"Masa KG ",false);
        window.AddSlider(10,10,180,20,mass_min,mass_max,this.massas[0],"1 Masa KG - ",true).OnChange = (value) =>
        {
            this.massas[0] = value;
        }
        window.AddSlider(10,40,180,20,mass_min,mass_max,this.massas[1],"2 Masa KG - ",true).OnChange = (value) =>
        {
            this.massas[1] = value;
        }
        window.AddSlider(10,70,180,20,mass_min,mass_max,this.massas[2],"3 Masa KG - ",true).OnChange = (value) =>
        {
            this.massas[2] = value;
        }
        window.AddSlider(10,100,180,20,mass_min,mass_max,this.massas[3],"4 Masa KG - ",true).OnChange = (value) =>
        {
            this.massas[3] = value;
        }
        window.AddSlider(10,130,180,20, 0.1,9,this.gravitiy,"Gravidade - ",true).OnChange = (value) =>
        {
            this.gravitiy = value;
        }
        window.AddSlider(10,160,180,20, 0,1,this.coeficiente,"Coeficiente - ",true).OnChange = (value) =>
        {
            this.coeficiente = value;
        }


        window.AddButton(50,195,"Recomeçar").OnClick = () =>
        {
            this.removePlayer();
            this.addNodes();
        }

        this.Add(window);
        this.addNodes();
      
    }
    addNodes()
    {

        this.addNode(100,100,this.massas[0]);
        this.addNode(200,100,this.massas[1]);
        this.addNode(300,100,this.massas[2]);
        this.addNode(400,100,this.massas[3]);
    }
    removePlayer()
    {
       for (let i = 0; i < this.nodes.length; i++)
       {
           if (this.nodes[i].name == "player")
           {
               this.nodes.splice(i,1);
              i--;
           }
       }
    }
    addNode(x,y,mass)
    {

        
        let node = new Actor("player",mass);
        
        

        node.Add(new Player(mass,this.gravitiy,this.coeficiente));

     
        node.y=y;
        node.scaleX=0.5 * (mass*0.5);
        node.scaleY=0.5 * (mass*0.5);
        node.x= x + (mass * node.scaleX);

        // nodeShape.x=-40 * node.scaleX;
        // nodeShape.y=-40 * node.scaleY;
        
        this.Add(node);
    }
   

    render(context)
    {
       
        Game.SetColor(45,45,100);
        Game.SetAlpha(50);
        Game.Rectangle(0,SCREEN_HEIGHT-250,SCREEN_WIDTH,300);


        Game.SetColor(45,45,45);
        Game.Rectangle(0,SCREEN_HEIGHT-60,SCREEN_WIDTH,10);

        Game.SetAlpha(255);
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
    resize(w,h)
    {

       
    }
}




let width  = window.innerWidth;
let height =window.innerHeight;

Game.Init(true,width, height);

Game.AddImage('assets/actors/red_body_squircle.png',"red_body_squircle");
Game.AddImage('assets/actors/blue_body_squircle.png',"blue_body_squircle");
Game.AddImage('assets/actors/green_body_squircle.png',"green_body_squircle");

Game.AddImage('assets/actors/face_a.png',"face_a");
Game.AddImage('assets/actors/face_b.png',"face_b");
Game.AddImage('assets/actors/face_c.png',"face_c");
Game.AddImage('assets/actors/face_d.png',"face_d");
Game.AddImage('assets/actors/face_e.png',"face_e");
Game.AddImage('assets/actors/face_f.png',"face_f");
Game.AddImage('assets/actors/face_g.png',"face_g");
Game.AddImage('assets/actors/face_h.png',"face_h");
Game.AddImage('assets/actors/face_i.png',"face_i");
Game.AddImage('assets/actors/face_j.png',"face_j");
Game.AddImage('assets/actors/face_k.png',"face_k");
Game.AddImage('assets/actors/face_l.png',"face_l");
Game.AddImage('assets/Backgrounds/backgroundDesert.png',"backgroundDesert");




Game.LoadImagesDelay(0).then(() => 
{
    console.log("Images loaded");

    Game.AddScene("main", new MainScene());
    Game.SetCurrentScene("main");

    Game.Start();
});


