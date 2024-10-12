import fs from 'fs';
import path from 'path';
import * as auth from '../controllers/authController.js';
import Template from '../models/TemplateModel.js';


export const getHome = (req, res) => {
    // Assuming you have logic to determine the user here
    const user = req.user;
    res.render('home', { user }); // Pass the user variable to the home.ejs template
};



export const getMusic = async (req, res) => {
    let user = -1;
    if (req.user){
        user = req.user;
    }
    let sortBy = req.query.sortBy || 'Number';  
    let sortOrder = parseInt(req.query.sortOrder) || 1;  
    let searchQuery = req.query.search || '';

    let sortCriteria = {};
    if (sortBy === 'Composer' || sortBy === 'Grade' || sortBy === 'Title' || sortBy === 'Number') {
        sortCriteria[sortBy] = sortOrder;
    } else {
        sortCriteria[sortBy] = sortOrder === 1 ? 1 : -1;
    }
 
    let query = {};
    if (searchQuery) {
        query = {
            $or: [
                { Title: { $regex: searchQuery, $options: 'i' } },
                { Composer: { $regex: searchQuery, $options: 'i' } },
                { Arranger: { $regex: searchQuery, $options: 'i' } }
            ]
        };
    }

    try {
        let data;
        if (sortBy === 'Composer') {
            const templates = await Template.find(query).sort(sortCriteria);
            const composers = {};
            templates.forEach(template => {
                const composer = template.Composer;
                if (!composers[composer]) {
                    composers[composer] = [];
                }
                composers[composer].push(template);
            });
            data = { composers, sortBy, sortOrder };  
        } else {
            let sortField;
            if (sortBy === 'Title') {
                sortField = 'Title';
            } else if (sortBy === 'Grade') {
                sortField = 'Grade';  
            } else {
                sortField = 'Number';
            }
            data = await Template.find(query).sort({ [sortField]: sortOrder });
            data = { sortBy, sortOrder, data };  
        }

        // Fetch unique formats for filtering
        const uniqueFormats = await Template.distinct('Format');
        // Fetch unique styles for filtering
        const uniqueStyles = await Template.distinct('Style');

        // Add uniqueFormats and uniqueStyles to the data object
        data.uniqueFormats = uniqueFormats;
        data.uniqueStyles = uniqueStyles;

        // Render the music view with the updated data
        res.render('music', { ...data, searchQuery, user });

    } catch (error) {
        console.error('Error fetching music:', error);
        res.status(500).send('Internal Server Error');
    }
    
};


export const getScoreDetails = async (req, res) => {
    const scoreId = req.params.scoreId;

    try {
        const score = await Template.findById(scoreId);
        res.render('scoreDetails', { score, user: req.user });
    } catch (error) {
        console.error('Error fetching score details:', error);
        res.status(500).send('Internal Server Error');
    }
};


export const updateScoreDetails = async (req, res) => {
    const scoreId = req.params.scoreId;
    const {
        editNumber,
        editTitle,
        editComposer,
        editArranger,
        editPublisher,
        editStyle,
        editGrade,
        editTime,
        editFormat,
        editNotes,
        editAuxiliary // No change needed here
    } = req.body;

    try {
        // Convert the string value of editAuxiliary to a boolean
        const auxWindsPercAdded = editAuxiliary === 'true' || editAuxiliary === 'on'; // Handle both 'true' and 'on' for checkbox

        await Template.findByIdAndUpdate(scoreId, {
            Number: editNumber,
            Title: editTitle,
            Composer: editComposer,
            Arranger: editArranger,
            Publisher: editPublisher,
            Style: editStyle,
            Grade: editGrade,
            Time: editTime,
            Format: editFormat,
            Notes: editNotes,
            AuxWindsPercAdded: auxWindsPercAdded // Update AuxWindsPercAdded field
        });
        res.redirect(`/music/${scoreId}`);
    } catch (error) {
        console.error('Error updating score details:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const createNewScore = async (req, res) => {
    try {
        const newScore = await Template.create({
            Title: "New Score Title"
        });
        res.json({ scoreId: newScore._id });
    } catch (error) {
        console.error('Error creating new score:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const deleteScore = async (req, res) => {
    const scoreId = req.params.scoreId;

    try {
        await Template.findByIdAndDelete(scoreId);
        res.json({ message: 'Score deleted successfully.' });
    } catch (error) {
        console.error('Error deleting score:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};