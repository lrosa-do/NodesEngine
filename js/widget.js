"use strict";
class Widget extends Basic
{
    constructor()
    {
        super("Widget");
        this.x=0;
        this.y=0;
        this.dragging=false;
        this.width  = 1;
        this.height = 1;
        this.parent=null;
        this.focus =false;
        this.bound = new Bound(0,0,this.width,this.height);
        this.tag="";
    }
    realX()
    {
        if (this.parent!==null)
        {
            return  this.parent.x + this.x;
        }
        return this.x;
    }
    realY()
    {
        if (this.parent!==null)
        {
            return  this.parent.y + this.y;
        }
        return this.y;
    }
    UpdateBound()
    {
        this.bound.x=this.realX();
        this.bound.y=this.realY();
        this.bound.width=this.width;
        this.bound.height=this.height;
    }
    MouseIn(x,y)
    {
        return this.bound.contains(x,y);
    }
    setTag(tag)
    {
        this.tag=tag;
        return this;
    }
}

class Slider extends Widget 
{
    constructor(min, max, value, horizontal =true) 
    {
        super();
        this.min = min;
        this.max = max;
        this.value = Math.min(Math.max(value, min), max);
        this.horizontal = horizontal;
        this.label="";
        this.OnChange = null;
        this.red=224;
        this.green=224;
        this.blue=224;
    }

    setOnChange(event)
    {
        this.OnChange=event;
        return this;
    }

    setLabel(text)
    {
        this.label=text;
        return this;
    }

    render() 
    {
        this.UpdateBound();
        this.setAlpha();
     

        if (this.focus)
        {
            // ctx.strokeStyle = '#827D7B';
            // ctx.lineWidth = 1.1;
            // ctx.strokeRect(this.bound.x, this.bound.y, this.bound.width, this.bound.height);
            // ctx.lineWidth=1;
       
            rect(ctx, this.bound.x, this.bound.y, this.bound.width, this.bound.height, makecol(150,200,200,1),1.5);
        }

    
        if (this.horizontal) 
        {
            this.setFillColor();
            ctx.fillRect(this.realX(), this.realY(), this.width, this.height);
            ctx.fillStyle = '#3498db';
            const normalizedValue = (this.value - this.min) / (this.max - this.min);
            const fillWidth = (this.width * normalizedValue);
            ctx.fillRect(this.realX(), this.realY(), fillWidth, this.height);
            let lx=this.realX() + this.width/2;
            let ly=this.realY() + this.height/2 ; 
            fillText(ctx,`${this.label} ${this.value.toFixed(1)}`,lx,ly,makecol(55,55,55,255),"center");
        } else 
        {
            this.setFillColor();
            ctx.fillRect(this.realX(), this.realY(), this.width, this.height);
            ctx.fillStyle = '#3498db';//'#383635';
            const normalizedValue = (this.value - this.min) / (this.max - this.min);
            const fillHeight = (this.height * normalizedValue);
            ctx.fillRect(this.realX(), this.realY() + this.height - fillHeight, this.width, fillHeight);
            let lx=this.realX() + this.width/2;
            let ly=this.realY() + this.height + 10; 
            fillText(ctx,`${this.label} ${this.value.toFixed(1)}`,lx,ly,makecol(55,55,55,255),"center");
        }
    }

    mouse_down(x, y, button) 
    {
        this.dragging = true;
       
        this.updateValue(x, y);
    }

    mouse_up(x, y, button) 
    {
        this.dragging = false;
        this.focus=false;
    }

    mouse_move(x, y)
     {
        this.focus=this.MouseIn(x,y);
        if (this.dragging && this.focus) 
        {
            this.updateValue(x, y);
        }
    }

    updateValue(x, y) 
    {
        let normalizedValue = 0;
        if (this.horizontal) 
        {
            normalizedValue = (x - this.realX()) / this.width ;
        } else
        {
            normalizedValue = (this.realY() + this.height - y) / this.height;
        }
        

        this.value = this.min + normalizedValue * (this.max - this.min);
        this.value = Math.min(this.max, Math.max(this.min, this.value));
        if (this.OnChange != null)
        {
            this.OnChange(this.value);
        }
    }
}
class Button extends Widget 
{
    constructor(label, x, y) 
    {
        super();
        this.label = label;
        this.is_down=false;
        this.OnClick = null;
  
        this.width = 100; //  padrão
        this.height = 40; //  padrão
        this.red=224;
        this.green=224;
        this.blue=224;
    }

    setLabel(text)
    {
        this.label=text;
        return this;
    }

    render() 
    {
        this.UpdateBound();
        this.setAlpha();

        if (this.focus && !this.is_down)
            rect(ctx, this.bound.x, this.bound.y, this.bound.width+1, this.bound.height+1, makecol(150,200,200,1),1.5);


       // ctx.fillStyle = '#e0e0e0';
        this.setFillColor();
        if (this.is_down)
            ctx.fillRect(this.realX()+1, this.realY()+1, this.width+1, this.height);
        else
             ctx.fillRect(this.realX(), this.realY(), this.width, this.height);
        

        ctx.fillStyle = '#505050';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        let textX = this.realX() + this.width / 2;
        let textY = this.realY() + this.height / 2;
        if (this.is_down)
            textX+=1;

        ctx.fillText(this.label, textX, textY);
    }

    mouse_down(x, y, button) 
    {
        if (this.MouseIn(x, y) && button===0)
        {
            console.log("click");
            this.is_down=true;
            if (this.OnClick!=null)
            {
                this.is_down=false;
                this.OnClick();
             
            }
        }
    }
    mouse_up(x, y, button) 
    {
        if (this.MouseIn(x, y) )
        {
            this.is_down=false;
        }
    }
    mouse_move(x, y)
    {
        this.focus=this.MouseIn(x,y);
    }
}


class Gui extends Widget
{
    constructor()
    {
        super();
        this.widgets=[];
    }

    add(widget)
    {
        widget.parent=this;
        widget.stage=this.stage;
        widget.game =this.game;
        this.widgets.push(widget);
    }

    addSlider(x,y,width,height,min,max,value,horizontal)
    {
        let slider = new Slider(min,max,value,horizontal);
        slider.x=x;
        slider.y=y;
        slider.width =width;
        slider.height=height;
        this.add(slider);
        return slider;
    }
    addButton(x,y,label)
    {
        let button = new Button(label)
        button.x=x;
        button.y=y;
        this.add(button);
        return button;
    }
    renderWidgets()
    {
        for (const child of this.widgets) 
        {
            child.render();
        }
    }

    updateWidgets(dt)
    {
        for (const child of this.widgets) 
        {
            child.update(dt);
        }
    }

    update(dt)
    {
   
        this.updateWidgets(dt);
    }

    render()
    {
        this.renderWidgets();
    }
    mouse_down(x,y,button)
    {
        for (const child of this.widgets) 
        {
            if (child.MouseIn(x,y))
                child.mouse_down(x,y,button);
        }
    }
    mouse_up(x,y,button)
    {
        for (const child of this.widgets) 
        {
            child.mouse_up(x,y,button);
        }
    }
    mouse_move(x,y)
    {
        for (const child of this.widgets) 
        {  
                child.mouse_move(x,y);
        }
    }
}
