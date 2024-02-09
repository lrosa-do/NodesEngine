"use strict";



class Basic 
{
    constructor(name)
    {
        this.type="BASIC";
        this.tag="";
        this.name=name;
        this.done=false;
        this.visible=true;
        this.active=true;
        this.scene=null;
        this.actions=[];
        this.children=[];
    }

    update(dt)
    {
       
    }
    process()
    {
        
    }
    render(ctx)
    {
        // Game.SetColor(255,0,255);
        // Game.CircleLine(0,0,2);
    }
    ready()
    {

    }
    close()
    {

    }

    mouse_down(x,y,button)
    {
        
    }
    mouse_up(x,y,button)
    {
        
    }
    mouse_move(x,y)
    {
        
    }




    OnUpdate(dt)
    {
        this.update(dt);
        for (const child of this.children) 
        {
            child.OnUpdate(dt);
        }

        for (let i = 0; i < this.actions.length; i++) 
        {
            const action = this.actions[i];
            action.update(dt);
            if (action.done) 
            {
                this.actions.splice(i, 1);
                action.close();
                i--;
            }
        }
       
    }
    OnRender(ctx)
    {
        this.render(ctx);
        for (const child of this.children) 
        {
            child.OnPreRender(ctx);
            child.OnRender(ctx);
            child.OnPostRender(ctx);
        }
       
    }
    OnPreRender(ctx)
    {

    }
    OnPostRender(ctx)
    {

    }


    OnProcess()
    {

        this.process();
        for (const child of this.children) 
        {
            child.OnProcess();
        }
    }

    OnMouseDown(x,y,button)
    {
        this.mouse_down(x,y,button);
        for (const child of this.children) 
        {
            child.OnMouseDown(x,y,button);
        }
        
    }
    OnMouseUp(x,y,button)
    {
        this.mouse_up(x,y,button);
        for (const child of this.children) 
        {
            child.OnMouseUp(x,y,button);
        }
        
    }
    OnMouseMove(x,y)
    {
        this.mouse_move(x,y);
        for (const child of this.children) 
        {
            child.OnMouseMove(x,y);
        }
        
    }


    AddAction(action)
    {
        action.parent=this;
        this.actions.push(action); 
        return action;
    }

    RemoveAction(tag)
    {
        for (let i = 0; i < this.actions.length; i++) 
        {
            const action = this.actions[i];
            if (action.tag ===tag) 
            {
                this.actions.splice(i, 1);
                break;
            }
        }
    }

    GetActionByTag(tag)
    {
        for (let i = 0; i < this.actions.length; i++) 
        {
            const action = this.actions[i];
            if (action.tag===tag) 
            {
            return tag;
            }
        }
        return null;
    }

    GetAction(index)
    {
        return  this.actions[index];
    }

    Add(childNode)
    {
        childNode.scene=this.scene;
        this.children.push(childNode);
        childNode.parent = this;
        childNode.ready();
    }
    Remove(name)
    {
        for (let i = 0; i < this.children.length; i++) 
        {
            const child = this.children[i];
            if (child.name === name) 
            {
                child.close(); 
                this.children.splice(i, 1);
                break;
            }
        }
    }
    GetChildByType(type)
    {
        for (let i = 0; i < this.children.length; i++) 
        {
            const child = this.children[i];
            if (child.type === type) 
            {
                return child;
            }
        }
        return null;
    
    }
}



class AnimationFrame 
{
    constructor(frameNumber, duration)
    {
        this.frameNumber = frameNumber;
        this.duration = duration;
    }
}

class Animation 
{
    constructor(name, frames, fps) 
    {
        this.name=name;
        this.ready=false;
        this.duration= 1000/fps;
        this.frames=[];
        for (let i=0;i < frames.length;i++)
        {
            this.frames.push(frames[i]);
           // console.log(frames[i]);
        }
        this.currentFrame = 0;
        this.lastFrameTime = 0;
       
        this.frame = frames[0] || 0;
      
     //   console.log(`Playing  ${this.name}  frame ${this.frame}`);

 
    }

    MaxFrames()
    {
        return this.frames.length;
    }

    update()
    {
        if (!this.ready) {
            return;
        }
        const currentTime = Date.now();
        const deltaTime = currentTime - this.lastFrameTime;

        if (deltaTime >= this.duration) 
        {
            this.currentFrame = (this.currentFrame + 1) % this.frames.length;
            this.lastFrameTime = currentTime;
        }

        this.frame = this.frames[this.currentFrame];
      //  console.log(`Playing  ${this.name}  frame ${this.frame}`);
    }

    play()
    {
        this.ready=true;
        this.currentFrame = 0;
        this.lastFrameTime = Date.now();
    }
    stop()
    {
        this.ready=false;
        this.currentFrame = 0;
        this.lastFrameTime = 0;
    }
    setFrame(index)
    {
        if (index < 0) index = 0;
        if (index >= this.MaxFrames()) index = this.MaxFrames() - 1;
        this.currentFrame = index;
        this.frame = this.frames[index];
        //console.log(this.frames);
     //   console.log(`set frame  ${this.name}  frame ${this.frame}`);
    }
    getFrame()
    {
        return this.frame;
    }
}
class Animator extends Basic
{
    constructor (sprite)
    {
        super("Animator");
        this.animations={};
        this.currentAnimation = null;
        this.type="Animator";
        this.sprite=sprite;
        
    }

    AddAnimation(name,frames, fps) 
    {
        let animation = new Animation(name,frames,fps);
        this.animations[name] =    animation;
        this.currentAnimation =    animation;
    }

    SetAnimation(name)
    {
        if (this.animations[name]) 
        {
            this.currentAnimation = this.animations[name];
        } else 
        {
            console.error(`Animação com nome "${name}" não encontrada.`);
        }
    }

    Play(name) 
    {
        if (this.animations[name]) 
        {
            this.currentAnimation = this.animations[name];
            this.currentAnimation.play();
        } else 
        {
            console.error(`Animação com nome "${name}" não encontrada.`);
        }
    }

    Stop()
    {
        if (this.currentAnimation !== null) {
            this.currentAnimation.stop();
        }
    }
    SetFrame(frame)
    {
        if (this.currentAnimation !== null)
        {
            this.currentAnimation.setFrame(frame);
        }
    }
    
    update(dt)
    {
        if (this.currentAnimation !== null)
        {
            this.currentAnimation.update(dt);
            
            let frame = this.currentAnimation.getFrame();    

            if (this.sprite!==null && frame!==undefined)
            {
                this.sprite.SetGraph(frame);
            }
        }
    }

}


class Sprite extends Basic
{
    constructor(graph,bound)
    {
        super("Sprite");
        this.graph=graph;
        this.image = getImage(graph);
        if (bound!==undefined)
        {
            this.useClip=true;
            this.clip = bound;
        } else 
        {
            this.clip = new Bound(0,0,1,1);
            this.useClip=false;
           
        }
        this.type="SPRITE";
    }
    SetClip(x,y,w,h)
    {
        this.clip.x=x;
        this.clip.y=y;
        this.clip.width =w;
        this.clip.height=h;
        this.useClip=true;

    }
    SetGraph(gr)
    {
        this.graph =gr;
    }
    OnRender(ctx)
    {
        if (!this.visible) return;
        super.OnRender(ctx);

        this.image = getImage(this.graph);
        if (this.image !==null)
        {
            if (this.clip!==null && this.useClip===true)
            {   
                let sourceWidth  = this.clip.width;
                let sourceHeight = this.clip.height;
                ctx.drawImage(this.image.image,this.clip.x,this.clip.y,sourceWidth,sourceHeight,0,0,sourceWidth,sourceHeight);
            } else
            {
                ctx.drawImage(this.image.image,0,0);
            }
            
        }
    }
}



class NodeScript extends Basic
{
    constructor(name)
    {
        super(name);
        this.type="NODE_SCRIPT";
    }
}


class Node extends Basic
{
    x=0;
    y=0;
    pivotX=0;
    pivotY=0;
    scaleX=1;
    scaleY=1;
    angle=0;

    constructor(name)
    {
        super(name);
        this.type="NODE";
    }
    SetPosition(x,y)    
    {
        this.x=x;
        this.y=y;
    }
    SetScale(x,y)
    {
        this.scaleX=x;
        this.scaleY=y;
    }
    SetPivot(x,y)
    {
        this.pivotX=x;
        this.pivotY=y;
    }
    SetAngle(angle)
    {
        this.angle=angle;
    }

    OnRender(ctx)
    {
        if (!this.visible) return;
        this.angle = ClampAngle(this.angle,0,360);
        var u = this.scaleX*this.pivotX;
        var v = this.scaleY*this.pivotY;
        ctx.save(); 
        ctx.translate(this.x,this.y);
        ctx.rotate(RAD(this.angle));
        ctx.translate(-this.u,-this.v);
        ctx.scale(this.scaleX,this.scaleY);
        super.OnRender(ctx);
        ctx.restore();

 
    }
    
}

class Shape
{
    constructor(color,solid)
    {
        this.color=color;
        this.solid=solid || false;
    }
}

class CircleShape  extends Shape
{
    constructor(color,radius,solid)
    {
        super(color,solid);
        this.radius=radius;
    }
}

class RectangleShape extends Shape
{
    constructor(color,width,height,solid)
    {
        super(color,solid);
        this.width=width;
        this.height=height;
    }
}

class NodeShape extends Node
{
    constructor(name)
    {
        super(name);
        this.type="NODE_SHAPE";
        this.shape = [];
    }

    render(ctx)
    {
        for (const shape of this.shape) 
        {
            if (shape instanceof CircleShape) 
            {
                if (shape.solid) 
                {
                    ctx.fillStyle = shape.color;
                    ctx.beginPath();
                    ctx.arc(0,0,shape.radius,0,2*Math.PI);
                    ctx.fill();
                } else 
                {
                    ctx.strokeStyle = shape.color;
                    ctx.beginPath();
                    ctx.arc(0,0,shape.radius,0,2*Math.PI);
                    ctx.stroke();
                }
            } else if (shape instanceof RectangleShape) 
            {
                if (shape.solid) 
                {
                    ctx.fillStyle = shape.color;
                    ctx.fillRect(-shape.width/2,-shape.height/2,shape.width,shape.height);
                } else 
                {
                    ctx.strokeStyle = shape.color;
                    ctx.strokeRect(-shape.width/2,-shape.height/2,shape.width,shape.height);
                }
            }
            
        }
    

       
    }

    AddShape(shape)
    {
        this.shape.push(shape);
        return shape;
    }
   
}


class NodeColider extends Node
{
    constructor(name)
    {
        super(name);
        this.type="NODE_COLIDER";
        this.shapes = [];
    }

    AddShape(shape)
    {
        this.shape.push(shape);
        return shape;
    }
    
}




class Actor  extends Node
{
    constructor(name, mass)
    {
        super(name);
        this.acceleration = new Vector2();
        this.velocity = new Vector2();
        this.force = new Vector2();
        this.mass = mass;
        

    }
    ApplyForce(force)
    {
        let f = force.divide(this.mass);
        
        this.acceleration=this.acceleration.add(force);
    }
    SetClipBoud(bound)
    {   

        if (this.x < bound.x)
        {
            this.velocity.x *= -1;
            this.x = bound.x;
        }
        else if (this.x > bound.width)
        {
            this.velocity.x *= -1;
            this.x = bound.width;
        }
        if (this.y < bound.y)
        {
            this.velocity.y *= -1;
            this.y = bound.y;
        }
        else
        if (this.y > bound.height) 
        {
        this.velocity.y *= -1;
        this.y = bound.height;
        }

    }
  

    OnProcess()
    {

        super.OnProcess();
        
        this.velocity = this.velocity.add(this.acceleration);

        this.x += this.velocity.x ;
        this.y += this.velocity.y ;   

        this.acceleration.mult(0);


    }
}
