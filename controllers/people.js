let User = require('../db/User')

const fetchPeople = async (user_id) => {
    let userInfo = await User.findOne({'_id':user_id});
    let userSibling = userInfo.siblings
    let userParentInfo = userInfo.parents
    let userChild = userInfo.childs
    let partnerInfo = await User.findOne({'_id':userInfo.partner})
    let peopleInfo = {
        "user":userInfo,
        "partner":partnerInfo,
        "parents":[],
        "childs":[],
        "siblings":[]
    }

    for (let i in userParentInfo){
        peopleInfo["parents"].push(await User.findOne({'_id':userParentInfo[i]}))
    }

    for(let i in userSibling){
        peopleInfo["siblings"].push(await User.findOne({'_id':userSibling[i]}))
    } 

    for(let i in userChild){
        peopleInfo["childs"].push(await User.findOne({'_id':userChild[i]}))
    } 
    return peopleInfo
} 

const getPerson = async (req, res) => {
    try{
        if (req.query.user_id != null){
            peopleInfo = await fetchPeople(req.query.user_id)
            req.session.user_id = req.query.user_id
            return res.status(200).render("./index",{
                peopleInfo: peopleInfo,
                peopleInfo1: null,
                peopleInfo2: null
            })
        }

        else if (req.query.zoomOut == 1){
            let user_id = req.session.user_id
            let peopleInfo = await fetchPeople(user_id)
            userParentsInfo = peopleInfo.parents
            let childInfo = peopleInfo.user.childs
            let peopleInfo1;
            for(let i = 0; i<userParentsInfo.length; i++){
                if(userParentsInfo[i].gender == "male"){
                    peopleInfo1 = await fetchPeople(userParentsInfo[i]._id)
                }
            }

            let peopleInfo2 = []
            for(let i = 0; i<childInfo.length; i++){
                peopleInfo2.push(await fetchPeople(childInfo[i]))
            }
            console.log(peopleInfo2)
            return res.status(200).render("./index",{
                peopleInfo: peopleInfo,
                peopleInfo1: peopleInfo1,
                peopleInfo2: peopleInfo2
            })
        }

        else{
            let user_id = req.session.user_id
            peopleInfo = await fetchPeople(user_id)
            return res.status(200).render("./index",{
                peopleInfo: peopleInfo,
                peopleInfo1: null,
                peopleInfo2: null
            })
        }
    }
    catch(error){
        console.log(error)
    }
}

const createPerson = async (req, res) => {

    const addParent = async(user_id, parent_id) => {
        await User.updateOne({'_id':user_id},{$push:{"parents":parent_id}})
    }

    const addSibling = async(user_id, sibling_id) => {
        await User.updateOne({'_id':user_id},{$push:{"siblings":sibling_id}})
    }

    const addChild = async(user_id, child_id) => {
        await User.updateOne({'_id':user_id},{$push:{"childs":child_id}})
    }

    const addPartner = async(user_id, partner_id) => {
        await User.updateOne({'_id':user_id},{'partner':partner_id})
    }

    let data = req.body
    let people = await User.create(data)

    let user_id = req.session.user_id
    let userInfo = await User.findOne({'_id':user_id});
    let userSiblingsInfo = userInfo.siblings
    let userParentsInfo = userInfo.parents
    let userChildInfo = userInfo.childs
    let userPartnerInfo = userInfo.partner

    if (data.relation === 'parent'){

        await addParent(user_id, people._id)
        await addChild(people._id, user_id)

        if (userParentsInfo !== null){
            for (let i in userParentsInfo){
                await addPartner(userParentsInfo[i], people._id)
                await addPartner(people._id, userParentsInfo[i])
            }
        }

        if (userSiblingsInfo !== null){
            for (let i in userSiblingsInfo){
                await addParent(userSiblingsInfo[i], people._id)
                await addChild(people._id, userSiblingsInfo[i])
            }
        }

        return res.status(201).redirect("http://localhost:5000/people")
    }

    else if (data.relation === 'sibling'){
        await addSibling(people._id, user_id)
        await addSibling(user_id, people._id)

        if (userParentsInfo !== null){
            for (let i in userParentsInfo){
                await addChild(userParentsInfo[i], people._id)
                await addParent(people._id, userParentsInfo[i])
            }
        }
        return res.status(201).redirect("http://localhost:5000/people")
    }

    else if (data.relation === 'child'){
        await addParent(people._id, user_id)
        await addChild(user_id, people._id)
        
        if (userPartnerInfo != null){
            await addParent(people._id, userPartnerInfo)
            await addChild(userPartnerInfo, people._id)
        }

        if (userChildInfo !== null){
            for (let i in userChildInfo){
                await addSibling(userChildInfo[i], people._id)
                await addSibling(people._id, userChildInfo[i])
            }
        }
        return res.status(201).redirect("http://localhost:5000/people")
    }

    else if (data.relation === 'partner'){
        await addPartner(user_id, people._id)
        await addPartner(people._id, user_id)

        if(userChildInfo !== null){
            for (let i in userChildInfo){
                await addParent(userChildInfo[i], people._id)
                await addChild(people._id, userChildInfo[i])
            }
        }

        return res.status(201).redirect("http://localhost:5000/people")
    }
    
    else {
        return res.status(404).send({success: false})
    }

}

module.exports = { getPerson, createPerson }

