# br-website
www.bruinreview.com v1 

Technologies: JavaScript ES7 heavy stack featuring MongoDB, Express. 

Key objects: 

```
Post   (bruinreview.com/home/postName/
{ 
Title: String!
Content: String! 
highlighted : [{userId, wordsHighlighted}] 
Views: Int! 
imgUrl: String!  [Link to s3 resource] 
quickFacts: {Author, DatePosted}
EditedBy: String! 
}  
```

