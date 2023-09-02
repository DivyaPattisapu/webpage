import { connectDB, disconnectDB, YourModel } from './checklistsModel';
export default async function handler(req, res) {
    if (req.method === 'POST') {
      // check if checklist_request is empty
      const { task, email, id } = req.body;

      // connect to the database
      await connectDB();

  
      console.log('email: ', email)
  
      try {
        // all documents in the collection YourModel with the email will be returned
        const newDocument = await YourModel.find({ _id: id });
        if (email !== newDocument[0].email) {
            return res.status(400).json({ "email": email })
        }

        // edit the tasklist
        let tasklist = newDocument[0].tasklist;
        let newTasklist = {};
        for (let key in tasklist) {
            if (key === task) {
                // delete the task
                continue;
            }
            newTasklist[key] = tasklist[key];
        }
        newDocument[0].tasklist = newTasklist;
        await newDocument[0].save();
        console.log('Document updated successfully');


        // console.log('Document found', newDocument);
        res.status(200).json({ "message": "Document updated successfully" });
      }
      catch (error) {
        console.log('Error searching for document:', error);
        res.status(500).json({});
      }
      
      await disconnectDB();
    }
  

  }