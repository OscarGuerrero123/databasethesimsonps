const {request, response} = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db');
const simsonpsModel = require('../models/simsonps');

const listsimsonps = async (req = request, res = response) => {
    let conn;

    try {
        conn = await pool.getConnection();

        const simsonps = await conn.query(simsonpsModel.getALL, (err) =>{
            if(err){
                throw err;
            }

        })
        res.json(simsonps);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);     
    }finally{
        if(conn){
            conn.end();
        }
    }
}

const listsimsonpsByID = async (req = request, res = response) =>{
    const {id} = req.params;
    let conn;

    if(isNaN(id)){
        res.status(400).json({msg: `The ID ${id} is invalid`});
        return;
    }

    try {
        conn = await pool.getConnection();

        const [simsonps] = await conn.query(simsonpsModel.getByID, [id], (err) => {
            if(err){
                throw err;
            }
        })

        if(!simsonps){
            res.status(404).json({msg: `name with ID ${id} not found`});
            return;
        }
        res.json(simsonps);

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
        
    }finally{
        if(conn){
            conn.end();
        }
    }
}

const addsimsonps =async (req = request, res = response) => {
    const {
        password,
        name,
        total,
        train,
        test,
        bounding_box,
        is_active = 1
    }= req.body

    if(!password || !name || !total || !train || !test || !bounding_box){
        res.status(400).json({msg: 'Missing iformation'});
        return;

    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const simsonps = [passwordHash, name, total, train, test, bounding_box, is_active]
    let conn;

    try {
        conn = await pool.getConnection();

        const [usernameExist] = await conn.query(simsonpsModel.getByUsername, [name], (err) => {
            if(err) throw err;
        })
        if (usernameExist){
            res.status(409).json({msg: `The year ${name} already exists`});
            return;
        }

        const simsonpsAdd = await conn.query(simsonpsModel.addRow, [...simsonps], (err) =>{
            if(err) throw err;
        })
        if(simsonpsAdd.affectedRows === 0){
            throw new Error('simsonps not added');
        }
        res.json({msg: 'simsonps added succesfully'});

        
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
        
    }finally{
        if(conn) conn.end();
    }
}

const updateSimsonps = async (req = request, res = response) =>{
    let conn;

    const{
        password,
        name,
        total,
        train,
        test,
        bounding_box,
        is_active

    } = req.body;

    const {id} =req.params;

    let passwordHash;
    if(password){
        const saltRounds = 10;
        passwordHash = await bcrypt.hash(password, saltRounds);
    }

    let simsonpsNewData = [
        passwordHash,
        name,
        total,
        train,
        test,
        bounding_box,
        is_active
    ];
    
    try{
        conn = await pool.getConnection();

        const [simsonpsExists] = await conn.query(simsonpsModel.getByID, [id], (err) =>{
            if(err) throw err;
        }
        );
        if(!simsonpsExists || simsonpsExists.is_active === 0){
            res.status(400).json({msg: `simsonps with ID ${id} not found`});
            return
        }
        const [usernameExist] = await conn.query(simsonpsModel.getByUsername, [name], (err) => {
            if(err) throw err;
        })
        if (usernameExist){
            res.status(409).json({msg: `simsonps ${year} already exists`});
            return;
        }

        const simsonpsOldData = [
            simsonpsExists.password,
            simsonpsExists.name,
            simsonpsExists.total,
            simsonpsExists.train,
            simsonpsExists.test,
            simsonpsExists.bounding_box,
            simsonpsExists.is_active,
        ];

        simsonpsNewData.forEach((simsonpsData, index) =>{
            if(!simsonpsData){
                simsonpsNewData[index] = simsonpsOldData[index];
            }
        })
        const simsonpsUpdated = await conn.query(
            simsonpsModel.updateRow,[...simsonpsNewData, id],
            (err) => {
                if (err) throw err;
            }
        )
        if (simsonpsUpdated.affectedRows === 0){
            throw new Error('simsonps not updated');
        }
        res.json({msg: 'simsonps updated succesfully'});
    }catch (error){
        console.log(error);
        res.status(500).json(error);
    }finally{
        if(conn) conn.end();
    }
}

const deleteSimsonps = async (req = request, res = response)=>{
    let conn;
    const {id} = req.params;

    try {
        conn = await pool.getConnection();

        const [simsonpsExists] = await conn.query(simsonpsModel.getByID, [id], (err) =>{
            if(err) throw err;
        }
        );
        if(!simsonpsExists || simsonpsExists.is_active === 0){
            res.status(400).json({msg: `simsonps with ID ${id} not found`});
            return
        }
        const simsonpsDeleted = await conn.query(
            simsonpsModel.deleteRow, [id], (err) =>{
                if(err) throw err;
            }
        );
        if(simsonpsDeleted.affectedRows === 0){
            throw new Error('simsonps not deleted');
        }
        res.json({msg: 'simsonps deleted succesfully'});

    } catch (error) {
        console.log(error);
        res.status(500).json(error);  
    }finally{
        if(conn) conn.end();
    }
}

const signInUser = async (req = request, res = response) =>{
    let conn;

    const {name, password} = req.body;

    try{
        conn = await pool.getConnection();

        if(!name || !password){
            res.status(400).json({msg: 'You must send year and password'});
            return;
        }

        const [simsonps] = await conn.query(simsonpsModel.getByUsername,
            [name],
            (err) =>{
                if(err)throw err;
            }
            );
            if (!simsonps){
                res.status(400).json({msg: `Wrong year or password`});
                return;
            }

            const passwordOK = await bcrypt.compare(password, simsonps.password);

            if(!passwordOK){
                res.status(404).json({msg: `Wrong year or password`});
                return;
            }

            delete(simsonps.password);

            res.json(simsonps);
    }catch (error){
        console.log(error);
        res.status(500).json(error);
    }finally{
        if(conn) conn.end();
    }
}



module.exports = {listsimsonps, listsimsonpsByID, addsimsonps, updateSimsonps, deleteSimsonps, signInUser}
