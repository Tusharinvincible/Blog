const express=require("express");
const app=express();
const ejs=require("ejs");

const _=require("lodash");

app.set('view engine', 'ejs');
app.use(express.static("public"));

app.use(express.urlencoded({extended:true}));
const text1=`It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
`;
let titleData=``;
let postData=``;
var check=false;
var posts=[];


app.get("/",(req,res)=>{
    res.render("home",{titleOfPage:"Home Page",posts:posts,check:check});
})


app.get("/about",(req,res)=>{
    res.render("about",{paragraphText:text1,titleOfPage:"About Page",titleOfPost:""});
})

app.get("/contact",(req,res)=>{
    res.render("contact",{titleOfPage:"Contact Page",titleOfPost:""});
})

app.post("/compose",(req,res)=>{
    
    var obj={
        titleOfPost:req.body.publishText,
        paragraphText:req.body.postData

    };
    check=true;
   
   
    console.log(titleData );
    console.log(postData)
    posts.push(obj);
    res.redirect("/");
})
app.get("/compose",(req,res)=>{
    res.render("compose",{titleOfPage:"Compose"});
})

app.get("/posts/:postName",(req,res)=>{
    const requestedTitle = _.lowerCase(req.params.postName);

    posts.forEach((post)=>{
        const storedTitle= _.lowerCase(post.titleOfPost);

        if(storedTitle===requestedTitle){
            res.render("Post",{title:post.titleOfPost,content:post.paragraphText});
        }
    });
    
  

});

app.listen(3000,()=>{
    console.log("App is running on PORT 3000");
})
