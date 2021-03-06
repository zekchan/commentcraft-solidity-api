import XXH from 'xxhashjs';
import Web3 from 'web3';
import contract from 'truffle-contract';

const RPC_HOST = 'localhost';
const RPC_PORT = '8545';
const provider = new Web3.providers.HttpProvider(`http://${RPC_HOST}:${RPC_PORT}`);
window.web3e = new Web3(provider);
const account = window.web3e.eth.accounts[0];
const Commentcraft = contract(require('./build/contracts/CommentCraft.json'));
Commentcraft.setProvider(provider);
Commentcraft.deployed()
  .then(instance => {
    window.CCONTRACT = instance;
  });
export const getId = (data) => parseInt(XXH.h32(data, 0xABCD).toString(16), 16);

export const getPosts = id => Commentcraft.deployed()
  .then(instance => instance.getPagespostsData.call(id));

export const getPost = id => Commentcraft.deployed()
  .then(instance => instance.getPost.call(id));

export const createPost = (pageId, content) => Commentcraft.deployed()
  .then(instance => {
    const postId = getId(`${pageId}${content}${Math.random()}`); // uniq post id

    return instance.createPost(pageId, postId, content, { from: account })
      .then(() => postId);
  });