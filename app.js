const express=require("express");

const mongoose=require("mongoose");
const app=express();
const ejs=require("ejs");

const _=require("lodash");

app.set('view engine', 'ejs');
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/blogDB");

const blogSchema=new mongoose.Schema({
    name:String,
    blogData:String,
    likes:Number
})

const Blog=mongoose.model("Blog",blogSchema);
const defaultBlog=new Blog({
    name:"Abc",
    blogData:`This is my first Blog`,
    likes:0
})
   
app.use(express.urlencoded({extended:true}));
const text1=`It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
`;





app.get("/",(req,res)=>{
    Blog.find((err,blogs)=>{
        if(err){
            console.log(err);
        }
        else{
            if(blogs.length===0){
                defaultBlog.save();
                res.redirect("/");
                
            }
            else{
            

                res.render("home",{titleOfPage:"Home",posts:blogs});
            }
        }
       
    })
    
})


app.get("/about",(req,res)=>{
    res.render("about",{paragraphText:text1,titleOfPage:"About Page",titleOfPost:""});
})

app.get("/contact",(req,res)=>{
    res.render("contact",{titleOfPage:"Contact Page",titleOfPost:""});
})

app.post("/compose",(req,res)=>{
    
    
        const blogName=_.capitalize(req.body.publishText);
        const paragraphText=req.body.postData;

        Blog.findOne({name:blogName},(err,blog)=>{
            if(err){

            }
            else{
                if(blog){
                    Blog.findOneAndUpdate({name:blogName},{$set:{blogData:paragraphText}},(err)=>{
                        if(err){
                            console.log("Update and Error",err);
                        }
                        else{
                            console.log("Updated Succesfully");
                        }
                    })
                    res.redirect("/");
                }
                else{
                    const temp=new Blog({
                        name:blogName,
                        blogData:paragraphText,
                        likes:0
                    })
                    temp.save();
                    res.redirect("/");
                }
            }
        })

    
   
   
  
})

app.get("/compose",(req,res)=>{
    res.render("compose",{titleOfPage:"Compose"});
})

app.get("/posts/:postName",(req,res)=>{
    const requestedTitle = _.capitalize(req.params.postName);
   
   Blog.findOne({name:requestedTitle},(err,blog)=>{
       if(err){
            console.log("Error of Posts",err);
       }
       else{
           console.log("Title of Post Name:  ",requestedTitle);
        res.render("post",{title:blog.name,content:blog.blogData});
       }
   })
    
  

});
app.post("/delete",(req,res)=>{
    const deleteId=req.body.delteBlog;
    console.log(deleteId);
    Blog.deleteOne({_id:deleteId},(err)=>{
        if(err){
            console.log("Deleted Error ",err);

        }
        else{
            console.log("Deleted Succesfully:  ");
            
            res.redirect("/");
        }
    })
})

app.post("/like",(req,res)=>{

    const likeBlog=req.body.likeBlog;
    Blog.findOne({_id:likeBlog},(err,blog)=>{
        if(err){
            console.log("Likes Error",err);
            
        }
        else{
            blog.likes+=1;
            blog.save();
            res.redirect("/");
        }
    })
})
app.listen(27017,()=>{
    
    console.log("App is running on PORT 27017");
})
