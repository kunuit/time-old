const { uploadBG, uploadPle, uploadPle2 } = require('../../utils/multer');
const User = require('../../models/schema/user.schema');
const People = require('../../models/schema/people.schema');
const Image = require('../../models/schema/image.schema');
const { get } = require('mongoose');

const postBG = async (req, res) => {
  // upload img
  await uploadBG(req, res, async (err) => {
    try {
      console.log(req.body);
      const { imgBG } = req.body;
      const { idUser, username } = req.user;

      console.log(typeof imgBG, imgBG);
      if (err) return res.status(400).send({ err });
      console.log(req.file);
      if (!req.file) return res.status(400).send({ err: 'No file selected' });
      let pathBG = `uploads/${username}/background/${req.file.filename}`;
      const getUsr = await User.findOne({ _id: idUser });
      getUsr.imgBG = pathBG;
      await getUsr.save();
      res.send({ message: 'upload success' });
    } catch (error) {
      console.log(error);
      res.status(400).send({ message: 'something else in uploadBG' }, error);
    }
  });
};

const postPle = async (req, res) => {
  await uploadPle(req, res, async (err) => {
    try {
      const { name, birthday } = req.body;
      const { username, idUser } = req.user;
      if (!name || !birthday)
        return res.status(400).send({ message: 'plz add name & birthday' });
      if (err) return res.status(400).send({ err });
      console.log(req.files);
      if (!req.files) return res.status(400).send({ err: 'No file selected' });
      const twoPer = await People.find({ idUser });
      if (twoPer >= 2)
        return res.status(400).send({ message: 'only two person ! sr' });
      let newPle = await People.create({
        idUser,
        name,
        birthday,
      });
      console.log(newPle);
      const getPle = await People.findOne({
        idUser,
        name,
        birthday,
      });
      // từng ảnh một
      const addImg = req.files.map(async (img) => {
        link = `uploads/${username}/people/${img.filename}`;
        await Image.create({
          idPeople: getPle._id,
          link,
        });
        return Promise.resolve();
      });
      await Promise.all(addImg);
      res.send({ message: 'upload success' });
    } catch (err) {
      console.log(err);
      res.status(400).send({ message: 'something else in uploadBG' }, err);
    }
  });
};

const getBG = async (req, res) => {
  try {
    const { idUser } = req.user;
    const BG = await User.findOne({ _id: idUser });
    if (!BG) return res.status(400).status({ message: 'ko get dc' });
    res.send({ imgBG: BG.imgBG });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: 'something else get BG' }, error);
  }
};

const getPle = async (req, res) => {
  try {
    const { idUser } = req.user;
    const Ple = await People.find({ idUser });
    // console.log(Ple);
    let data = new Array();

    let person = Ple.map(async (e) => {
      // console.log(e);
      let one = {
        name: e.name,
        birthday: e.birthday,
        newLink: [],
      };
      const getLink = await Image.find({ idPeople: e._id });
      // console.log(getLink);
      let link = getLink.map(async (e) => {
        one.newLink = [...one.newLink, e.link];
        return Promise.resolve();
      });
      await Promise.all(link);

      data = [...data, one];
      return Promise.resolve();
    });
    await Promise.all(person);
    console.log(data);
    res.send(data);
  } catch (error) {}
};

const getAll = async (req, res) => {
  try {
    const getUsr = await User.find({});
    const getPle = await People.find({});
    const getImg = await Image.find({});
    // console.log(getUsr, getPle);
    res.send({ getUsr, getPle, getImg });
  } catch (error) {
    console.log(error);
    res.status(400);
  }
};

module.exports = {
  postBG,
  postPle,
  getAll,
  getBG,
  getPle,
};
