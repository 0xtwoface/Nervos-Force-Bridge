import Web3 from 'web3';
import * as PlaylistsJSON from '../../../build/contracts/Playlists.json';
import { Playlists } from '../../types/Playlists';

const DEFAULT_SEND_OPTIONS = {
    gas: 6000000
};

const DEPLOYED_CONTRACT_ADDRESS = '0xAFb93EF21bC061a88afB539d5fdD926DB942869A';
export class PlaylistsWrapper {
    web3: Web3;

    contract: Playlists;

    address: string;

    constructor(web3: Web3) {
        this.web3 = web3;
        this.address = DEPLOYED_CONTRACT_ADDRESS;
        this.contract = new web3.eth.Contract(PlaylistsJSON.abi as any) as any;
        this.contract.options.address = DEPLOYED_CONTRACT_ADDRESS;
    }

    get isDeployed() {
        return Boolean(this.address);
    }

    async getTotalPlaylist(fromAddress: string) {
        const data = await this.contract.methods.totalPlaylist().call({ from: fromAddress });

        return parseInt(data, 10);
    }

    async getPlaylist(id: number, fromAddress: string) {
        const data = await this.contract.methods.playlists(id).call({ from: fromAddress });

        const newPlaylist = {
            id: Number(data.id),
            name: data.name,
            songs: Number(data.songs),
            creator: data.creator
        };
        return newPlaylist;
    }

    async createPlaylist(name: string, fromAddress: string) {
        const tx = await this.contract.methods.createPlaylist(name).send({
            ...DEFAULT_SEND_OPTIONS,
            from: fromAddress
        });

        return tx;
    }

    async addSongToPlaylist(name: string, playlistId: number, fromAddress: string) {
        const tx = await this.contract.methods.addSongToPlaylist(name, playlistId).send({
            ...DEFAULT_SEND_OPTIONS,
            from: fromAddress
        });

        return tx;
    }

    async getPlaylistSongs(playlistId: number, fromAddress: string) {
        const data = await this.contract.methods.getPlaylistSongs(playlistId).call({
            ...DEFAULT_SEND_OPTIONS,
            from: fromAddress
        });

        return data;
    }

    // async deploy(fromAddress: string) {
    //     const tx = this.contract
    //         .deploy({
    //             data: PlaylistsJSON.bytecode,
    //             arguments: []
    //         })
    //         .send({
    //             ...DEFAULT_SEND_OPTIONS,
    //             from: fromAddress
    //         });

    //     let transactionHash: string = null;
    //     tx.on('transactionHash', (hash: string) => {
    //         transactionHash = hash;
    //     });

    //     const contract = await tx;

    //     this.useDeployed(contract.options.address);

    //     return transactionHash;
    // }

    // useDeployed(contractAddress: string) {
    //     this.address = contractAddress;
    //     this.contract.options.address = contractAddress;
    // }
}
