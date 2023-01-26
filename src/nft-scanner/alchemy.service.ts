import { Injectable } from '@nestjs/common';
import { Network, Alchemy } from 'alchemy-sdk';
import { NftsService } from 'src/nfts/nft.service';
import { CollectionService } from 'src/collection/collection.service';
import { createAlchemyWeb3 } from '@alch/alchemy-web3';
import ERC1155_ABI from './abi/ERC1155.json';
import ERC1155_CHALLANGE_ABI from './abi/ERC1155Challenge.json';
import { AbiItem } from 'web3-utils';
import { UsersService } from 'src/users/users.service';
import fetch from 'node-fetch';
import { UpdateUserDTO } from 'src/users/dto/update-user.dto';
import { NftScannerService } from './nft-scanner.service';
import { TokensService } from 'src/tokens/tokens.service';
import axios from 'axios';

@Injectable()
export class AlchemyService {
  // alchemy = null;
  // web3 = null;
  // challengeContract = null;
  services = {};
  requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };
  constructor(
    private nftsService: NftsService,
    private collectionService: CollectionService,
    private usersService: UsersService,
    private nftScannerService: NftScannerService,
    private tokensService: TokensService,
  ) {
    const settingsEth = {
      apiKey: process.env.ALCHEMY_API_KEY_ETH,
      network: Network[process.env.ALCHEMY_NETWORK_ETH],
    };
    const settingsPoly = {
      apiKey: process.env.ALCHEMY_API_KEY_POLY,
      network: Network[process.env.ALCHEMY_NETWORK_POLY],
    };
    const web3Eth = createAlchemyWeb3(process.env.ALCHEMY_API_URL_ETH);
    const web3Poly = createAlchemyWeb3(process.env.ALCHEMY_API_URL_POLY);
    this.services[process.env.CHAIN_ID_ETH] = {
      alchemy: new Alchemy(settingsEth),
      web3: web3Eth,
      challengeContract: new web3Eth.eth.Contract(
        ERC1155_CHALLANGE_ABI as AbiItem[],
        process.env.CHALLENGE_ADDRESS_ETH_ERC1155,
      ),
      fetchURL: process.env.ALCHEMY_API_URL_ETH,
    };
    this.services[process.env.CHAIN_ID_POLY] = {
      alchemy: new Alchemy(settingsPoly),
      web3: web3Poly,
      challengeContract: new web3Poly.eth.Contract(
        ERC1155_CHALLANGE_ABI as AbiItem[],
        process.env.CHALLENGE_ADDRESS_POLY_ERC1155,
      ),
      fetchURL: process.env.ALCHEMY_API_URL_POLY,
    };
    this.services[process.env.CHAIN_ID_BSC] = {
      alchemy: null,
      web3: null,
      challengeContract: null,
      fetchURL: null,
    };
    this.services[process.env.CHAIN_ID_AVAL] = {
      alchemy: null,
      web3: null,
      challengeContract: null,
      fetchURL: null,
    };
  }

  async getTokens(): Promise<any> {
    const result = await axios({
      method: 'POST',
      url:
        'https://eth-goerli.alchemyapi.io/v2/iN-PGlLtC7flU86i-tx2WaGkp3Nz-J2_',
      data: {
        jsonrpc: '2.0',
        method: 'alchemy_getTokenBalances',
        params: ['0x5310369De4Cd907D2061c808c613dc3b8F5d6bd1', 'erc20'],
        id: '42',
      },
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        console.log(response.data);
        return response.data;
      })
      .catch((err) => {
        console.log(err.response);
        return err;
      });
    return result;
  }

  async searchTokens(ownerAddress, pageKey, nftScan, chain_id): Promise<any> {
    // return this.getTokens();
    if (this.services[chain_id].alchemy) {
      try {
        const nftMetadata = await this.services[
          chain_id
        ].alchemy.core.getTokenBalances(ownerAddress);
        console.log('nftMetadata', nftMetadata);
        for (let i = 0; i <= nftMetadata.tokenBalances.length; i++) {
          try {
            if (i == nftMetadata.tokenBalances.length) {
              const scan = {
                ...nftScan,
                status: 1,
                last_updated: new Date(),
              };
              await this.nftScannerService.update(scan);
              return this.tokensService.getTokensByUser(ownerAddress, chain_id);
            }
            const token = nftMetadata.tokenBalances[i];
            const existingToken = await this.tokensService.getTokenByUserAndAddress(
              ownerAddress,
              token.contractAddress,
              chain_id,
            );
            if (existingToken) {
              let balance = token.tokenBalance;
              balance = balance / Math.pow(10, existingToken.decimal);
              //balance = balance.toFixed(4);
              const update = {
                ...existingToken,
                balance: balance,
              };
              await this.tokensService.updateToken(update);
            } else {
              const metadata = await this.services[
                chain_id
              ].alchemy.core.getTokenMetadata(token.contractAddress);
              let balance = token.tokenBalance;
              balance = balance / Math.pow(10, metadata.decimals);
              const newToken = {
                user: ownerAddress,
                chain_id: chain_id,
                address: token.contractAddress.toLowerCase(),
                name: metadata.name,
                symbol: metadata.symbol,
                balance: balance,
                decimal: metadata.decimals,
              };
              await this.tokensService.addToken(newToken);
            }
          } catch (error) {
            console.log(error);
          }
        }
      } catch (exception) {
        console.log('exception', exception);
        const scan = {
          ...nftScan,
          status: 1,
          last_updated: new Date(),
        };
        await this.nftScannerService.update(scan);
        return this.tokensService.getTokensByUser(ownerAddress, chain_id);
      }
    } else {
      const scan = {
        ...nftScan,
        status: 1,
        last_updated: new Date(),
      };
      await this.nftScannerService.update(scan);
      return this.tokensService.getTokensByUser(ownerAddress, chain_id);
    }
  }

  async startScan(ownerAddress, pageKey, nftScan, chain_id): Promise<any> {
    if (this.services[chain_id].alchemy) {
      const options = {};
      if (pageKey) {
        options['pageKey'] = pageKey;
      }
      const nftData = await this.services[chain_id].alchemy.nft.getNftsForOwner(
        ownerAddress,
        options,
      );
      console.log('nfts', JSON.stringify(nftData));
      const nfts = nftData.ownedNfts;
      if (nfts.length == 0) {
        const scan = {
          ...nftScan,
          status: 1,
          last_updated: new Date(),
        };
        await this.nftScannerService.update(scan);
        return true;
      }
      for (let i = 0; i <= nfts.length; i++) {
        if (i == nfts.length) {
          if (nftData.pageKey && nftData.pageKey != undefined) {
            return this.startScan(
              ownerAddress,
              nftData.pageKey,
              nftScan,
              chain_id,
            );
          } else {
            const scan = {
              ...nftScan,
              status: 1,
              last_updated: new Date(),
            };
            await this.nftScannerService.update(scan);

            return true;
          }
        }
        try {
          const nft = nfts[i];
          // console.log('id', nft.tokenId);
          if (nft.tokenType !== 'ERC721') {
            const existingNft = await this.nftsService.getNFTByAssetIdAndCollectionAndHolder(
              nft.tokenId,
              nft.contract.address,
              ownerAddress,
            );
            // console.log('existingNft', existingNft);
            if (!existingNft) {
              //check collection exists
              const check = await this.checkAndSaveCollection(
                nft.contract.address,
                nft.balance,
                ownerAddress,
                chain_id,
              );

              if (check) {
                const owners = await this.getOwnersForNft(
                  nft.contract.address,
                  nft.tokenId,
                  chain_id,
                );
                // console.log(owners.owners.length);
                let totalSupply = nft.balance;
                if (owners.owners.length > 1) {
                  const _totalSupply = await this.getTotalSupply(
                    nft.contract.address,
                    ownerAddress,
                    nft.tokenId,
                    chain_id,
                  );
                  //console.log('totalSupply', totalSupply);
                  if (_totalSupply > 0) {
                    totalSupply = _totalSupply;
                  }
                }

                const airdropped = await this.services[
                  chain_id
                ].challengeContract.methods
                  .airdropped(nft.contract.address, nft.tokenId)
                  .call();
                // console.log('airdropped', airdropped);

                const nftObj = {
                  expiry: '',
                  type: 'art',
                  audio: null,
                  assetId: nft.tokenId,
                  contractType: 'ERC1155',
                  isForSell: false,
                  isForAuction: false,
                  holder: ownerAddress.toLowerCase(),
                  creator: ownerAddress.toLowerCase(),
                  price: 0,
                  lockedData: '',
                  nftType: 'art',
                  resale: true,
                  resaleCurrency: '',
                  loyaltyPercentage: 0,
                  supply: nft.balance > 0 ? nft.balance : 1,
                  fileType: 'image/jpeg',
                  dFile: '',
                  collectionType: nft.contract.address,
                  totalSupply: totalSupply,
                  airdropped: airdropped,
                  chain_id: chain_id,
                };
                if (nft.metadataError) {
                  nftObj['name'] = nft.tokenId;
                  nftObj['file'] =
                    'https://yaaas-test.s3-us-east-2.amazonaws.com/logo_white.png';
                } else {
                  nftObj['name'] = nft.rawMetadata.name;
                  nftObj['file'] = nft.rawMetadata.file
                    ? nft.rawMetadata.file.replace(
                        'ipfs://',
                        'https://ipfs.io/',
                      )
                    : nft.rawMetadata.image.replace(
                        'ipfs://',
                        'https://ipfs.io/',
                      );
                  nftObj['description'] = nft.rawMetadata.description;
                  nftObj['cover'] = nft.rawMetadata.cover
                    ? nft.rawMetadata.cover.replace(
                        'ipfs://',
                        'https://ipfs.io/',
                      )
                    : nft.rawMetadata.image.replace(
                        'ipfs://',
                        'https://ipfs.io/',
                      );
                  nftObj['externalLink'] = nft.rawMetadata.external_url
                    ? nft.rawMetadata.external_url
                    : '';
                }
                await this.nftsService.addNft(nftObj);
                // console.log(nftDb);
                const nftUser = await this.usersService.getUser(ownerAddress);
                const user: UpdateUserDTO = {
                  ...nftUser,
                  createdNFTCount:
                    parseInt(nftUser.createdNFTCount) + totalSupply,
                  ownedNFTCount:
                    parseInt(nftUser.ownedNFTCount) + parseInt(nft.balance),
                };
                delete user['likes'];
                delete user['challengeCreated'];
                delete user['challengeSubmitted'];
                await this.usersService.updateUser(user);
              }
            } else {
              //update token value
              if (existingNft.supply != nft.balance) {
                existingNft.supply = nft.balance;
                const nftUser = await this.usersService.getUser(ownerAddress);

                const user: UpdateUserDTO = {
                  ...nftUser,
                  ownedNFTCount:
                    parseInt(nftUser.ownedNFTCount) -
                    (existingNft.supply - parseInt(nft.balance)),
                };
                delete user['likes'];
                delete user['challengeCreated'];
                delete user['challengeSubmitted'];
                await this.usersService.updateUser(user);
              }

              if (!nft.metadataError || nft.metadataError == undefined) {
                existingNft['name'] = nft.rawMetadata.name;
                existingNft['file'] = nft.rawMetadata.file
                  ? nft.rawMetadata.file.replace('ipfs://', 'https://ipfs.io/')
                  : nft.rawMetadata.image.replace(
                      'ipfs://',
                      'https://ipfs.io/',
                    );
                existingNft['description'] = nft.rawMetadata.description;
                existingNft['cover'] = nft.rawMetadata.cover
                  ? nft.rawMetadata.cover.replace('ipfs://', 'https://ipfs.io/')
                  : nft.rawMetadata.image.replace(
                      'ipfs://',
                      'https://ipfs.io/',
                    );
                existingNft['externalLink'] = nft.rawMetadata.external_url
                  ? nft.rawMetadata.external_url
                  : '';
              }

              await this.nftsService.update(existingNft);
              // console.log('index', i);
            }
          } else {
            // token is not ERC1155, discard it.
            console.log('token is not ERC1155');
          }
        } catch (exception) {
          console.log('exception', exception);
        }
      }

      // for await (const nft of this.alchemy.nft.getNftsForOwnerIterator(
      //   ownerAddress,
      // )) {
      //   // console.log('ownedNft:', nft.tokenId);
      // }
    } else {
      const scan = {
        ...nftScan,
        status: 1,
        last_updated: new Date(),
      };
      await this.nftScannerService.update(scan);
      return false;
    }
  }
  async refreshMetadata(owner, contractAddress, tokenId, chain_id) {
    const meta = await this.getNftMetadata(contractAddress, tokenId, chain_id);

    // console.log('meta', meta);

    if (!meta.metadataError || meta.metadataError == undefined) {
      const existingNft = await this.nftsService.getNFTByAssetIdAndCollectionAndHolder(
        tokenId,
        contractAddress,
        owner,
      );

      existingNft['name'] = meta.rawMetadata.name;
      existingNft['file'] = meta.rawMetadata.file
        ? meta.rawMetadata.file.replace('ipfs://', 'https://ipfs.io/')
        : meta.rawMetadata.image.replace('ipfs://', 'https://ipfs.io/');
      existingNft['description'] = meta.rawMetadata.description;
      existingNft['cover'] = meta.rawMetadata.cover
        ? meta.rawMetadata.cover.replace('ipfs://', 'https://ipfs.io/')
        : meta.rawMetadata.image.replace('ipfs://', 'https://ipfs.io/');
      existingNft['externalLink'] = meta.rawMetadata.external_url
        ? meta.rawMetadata.external_url
        : '';

      await this.nftsService.update(existingNft);
    }

    return meta;
  }

  async getCollectionOwnerId(owner): Promise<any> {
    let collectionUser = await this.usersService.getUser(owner);

    if (!collectionUser) {
      // const randomName = uniqueNamesGenerator({
      //   dictionaries: [adjectives, colors],
      //   separator: '-',
      // });

      const userCount = await this.usersService.getNumberOfUsers('', '', '');
      const firstName = 'bullz';
      const lastName = userCount + 1 + process.env.USERNAME_SUFFIX;
      const user = {
        address: owner.toLowerCase(),
        firstname: firstName,
        lastname: lastName,
        email: 'famous@tiktok.com',
        username: firstName + lastName,
      };
      collectionUser = await this.usersService.addUser(user);
    }
    return collectionUser.id;
  }

  async checkAndSaveCollection(
    contractAddress,
    balance,
    ownerAddress,
    chain_id,
  ): Promise<any> {
    try {
      const existingCollection = await this.collectionService.getCollectionsByAddress(
        contractAddress,
      );
      // console.log('existingCollection', existingCollection);
      if (!existingCollection || !existingCollection.length) {
        const meta = await this.services[
          chain_id
        ].alchemy.nft.getContractMetadata(contractAddress);
        // console.log('contract metadata', meta);
        if (meta.tokenType == 'ERC1155' || balance > 1) {
          let owner = ownerAddress;
          try {
            const erc1155Contract = new this.services[
              chain_id
            ].web3.eth.Contract(ERC1155_ABI as AbiItem[], meta.address);
            owner = await erc1155Contract.methods.owner().call();
          } catch (error) {
            console.log('contract Errror', error);
          }

          const collectionOwnerId = await this.getCollectionOwnerId(owner);
          // console.log('The owner is: ' + owner);
          const collection = {
            image:
              'https://yaaas-test.s3-us-east-2.amazonaws.com/logo_white.png',
            name: meta.name ? meta.name : 'Imported Collection',
            symbol: meta.symbol ? meta.symbol : 'BULLZ',
            type: 'multiple',
            address: meta.address,
            user: collectionOwnerId,
            chain_id: chain_id,
          };
          await this.collectionService.addCollection(collection);
          // console.log('added', added);
          return true;
        } else {
          return false;
        }
      } else {
        // console.log('collection exists');
        return true;
      }
    } catch (exception) {
      console.log('checkAndSaveCollection Errror', exception);
      return false;
    }
  }

  async getNftMetadata(contractAddress, tokenId, chain_id): Promise<any> {
    const nftMetadata = await this.services[
      chain_id
    ].alchemy.nft.getNftMetadata(contractAddress, tokenId);
    // console.log('nftMetadata', nftMetadata);
    return nftMetadata;
  }

  async getOwnersForNft(contractAddress, tokenId, chain_id): Promise<any> {
    const owners = await this.services[chain_id].alchemy.nft.getOwnersForNft(
      contractAddress,
      tokenId,
    );
    // console.log('owners', owners);
    return owners;
  }

  async getOwnersForCollection(contractAddr, chain_id): Promise<any> {
    const fetchURL = `${this.services[chain_id].fetchURL}/getOwnersForCollection?contractAddress=${contractAddr}&withTokenBalances=true`;
    const collectionOwners = await fetch(fetchURL, this.requestOptions)
      .then((response) => {
        // console.log('response', response);
        return response.json();
      })
      // .then((response) => JSON.stringify(response, null, 2))
      // .then((result) => {
      //   return result;
      // })
      .catch((error) => console.log('error', error));
    return collectionOwners;
  }

  async getTotalSupply(
    contractAddress,
    ownerAddress,
    tokenId,
    chain_id,
  ): Promise<any> {
    // console.log(contractAddress, ownerAddress, tokenId);
    const collectionOwners = await this.getOwnersForCollection(
      contractAddress,
      chain_id,
    );
    // console.log('collectionOwners', collectionOwners);
    let totalSupply = 0;
    if (collectionOwners) {
      collectionOwners.ownerAddresses.forEach((element) => {
        // console.log('address', element.ownerAddress);
        // console.log('element', element.tokenBalances);
        element.tokenBalances.forEach((token) => {
          const _tokenId = parseInt(token.tokenId, 16);
          if (_tokenId == tokenId) {
            totalSupply += token.balance;
          }
        });
      });
    }
    return totalSupply;
  }
}
