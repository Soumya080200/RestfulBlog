var bodyParser=require("body-parser"),
	methodOverride=require("method-override"),
	expressSanitizer=require("express-sanitizer"),
	mongoose=require("mongoose"),
	express=require("express"),
	app=express();

mongoose.connect("mongodb://localhost:27017/restful_blog_app", {useNewUrlParser: true, useUnifiedTopology:true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

var blogSchema=new mongoose.Schema({
	title: String,
	image: String, 
	body: String,
	created: {type: Date, default: Date.now}
	
});

app.get("/", function(req, res){
	res.redirect("blogs");
})

var Blog = mongoose.model("Blog", blogSchema);

/*Blog.create(
	{
	title: "Pugs are the cutest",
	image: "https://thenypost.files.wordpress.com/2020/04/pugs-coronavirus.jpg?quality=80&strip=all",
	body: "pugs are a breed of dogs which are said to be originated from china. very cute but dumb. greatfor kids to play with."
	}, 
	function(err, blog){
	if(err){console.log(err)}
	else{
		console.log(blog);
	}
})*/
//index page 
app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs){
		if(err){
			console.log(err);
		}
		else{
			res.render("index", {blogs: blogs});
		}
	})
});
//new form to add blog
app.get("/blogs/new", function(req, res){
	res.render("new");
})
//post page
app.post("/blogs", function(req, res){
	req.body.blog.body=req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render("new")
		}
		else{
			res.redirect("/blogs")
		}
	})
})
//Show Post
app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs")
		}
		else{
			res.render("show", {blog: foundBlog});
		}
})
})
//edit post
app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("index");
		}
		else{
			res.render("edit", {blog: foundBlog});
		}
	})
	
})
//update post
app.put("/blogs/:id", function(req, res){
	req.body.blog.body=req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/index");
		}
		else{
			res.redirect("/blogs/" + req.params.id)
		}
	})
})
//DESTROY
app.delete("/blogs/:id", function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs")
		}
		else{
			res.redirect("/blogs")
		}
	})
})

app.listen(process.env.PORT || 3000, process.env.IP, function(req, res){
	console.log("server is listening");
});