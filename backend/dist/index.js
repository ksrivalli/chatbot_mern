import express from "express";
const app = express();
// GET - 
// PUT - 
// POST - 
// DELETE - 
app.use(express.json());
app.get("/hello", (req, res, next) => {
    return res.send("Hello");
});
app.post("/hello", (req, res, next) => {
    console.log(req.body.name);
    return res.send("Hello");
});
app.put("/hello", (req, res, next) => {
    console.log(req.body.name);
    return res.send("Hello");
});
app.delete("/user/:id", (req, res, next) => {
    console.log(req.params.id);
    return res.send("Hello");
});
app.listen(5001, () => console.log("Server open"));
//# sourceMappingURL=index.js.map