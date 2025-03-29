const FAQ=require("./src/models/Faq")

const storeFaq= async (req, res) => {
    try {
      const { question, answer } = req.body;
  
      
      if (!question || !answer) {
        return res.status(400).json({
           error: "Both question and answer are required!"
           });
      }
  
      const newFAQ = new FAQ({ question, answer });
      await newFAQ.save();
  
      res.status(201).json({
         message: "FAQ stored successfully!",
          data: newFAQ 
        });

    } catch (error) {
        console.log(error)
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  module.exports=storeFaq
  