import { Injectable } from '@nestjs/common';
import { Collection } from './collection.entity';

@Injectable()
export class DefaultCollections {
  getCollections() {
    const defaultCollections = [
      {
        address: process.env.ADMIN_COLLECTION_ETH_ERC1155.toLowerCase(),
        coverFileType: 'image/png',
        image:
          'https://yaaas-test.s3-us-east-2.amazonaws.com/1656680571719logo_black.png',
        name: 'BULLZ Collection',
        symbol: 'BULLZ',
        type: 'single',
        chain_id: process.env.CHAIN_ID_ETH,
      },
      {
        address: process.env.ADMIN_COLLECTION_ETH_ERC1155.toLowerCase(),
        coverFileType: 'image/png',
        image:
          'https://yaaas-test.s3-us-east-2.amazonaws.com/1656680571719logo_black.png',
        name: 'BULLZ Collection',
        symbol: 'BULLZ',
        type: 'multiple',
        chain_id: process.env.CHAIN_ID_ETH,
      },
      {
        address: process.env.ADMIN_COLLECTION_BSC_ERC1155.toLowerCase(),
        coverFileType: 'image/png',
        image:
          'https://yaaas-test.s3-us-east-2.amazonaws.com/1656680571719logo_black.png',
        name: 'BULLZ Collection',
        symbol: 'BULLZ',
        type: 'single',
        chain_id: process.env.CHAIN_ID_BSC,
      },
      {
        address: process.env.ADMIN_COLLECTION_BSC_ERC1155.toLowerCase(),
        coverFileType: 'image/png',
        image:
          'https://yaaas-test.s3-us-east-2.amazonaws.com/1656680571719logo_black.png',
        name: 'BULLZ Collection',
        symbol: 'BULLZ',
        type: 'multiple',
        chain_id: process.env.CHAIN_ID_BSC,
      },
      {
        address: process.env.ADMIN_COLLECTION_POLY_ERC1155.toLowerCase(),
        coverFileType: 'image/png',
        image:
          'https://yaaas-test.s3-us-east-2.amazonaws.com/1656680571719logo_black.png',
        name: 'BULLZ Collection',
        symbol: 'BULLZ',
        type: 'single',
        chain_id: process.env.CHAIN_ID_POLY,
      },
      {
        address: process.env.ADMIN_COLLECTION_POLY_ERC1155.toLowerCase(),
        coverFileType: 'image/png',
        image:
          'https://yaaas-test.s3-us-east-2.amazonaws.com/1656680571719logo_black.png',
        name: 'BULLZ Collection',
        symbol: 'BULLZ',
        type: 'multiple',
        chain_id: process.env.CHAIN_ID_POLY,
      },
      {
        address: process.env.ADMIN_COLLECTION_AVAL_ERC1155.toLowerCase(),
        coverFileType: 'image/png',
        image:
          'https://yaaas-test.s3-us-east-2.amazonaws.com/1656680571719logo_black.png',
        name: 'BULLZ Collection',
        symbol: 'BULLZ',
        type: 'single',
        chain_id: process.env.CHAIN_ID_AVAL,
      },
      {
        address: process.env.ADMIN_COLLECTION_AVAL_ERC1155.toLowerCase(),
        coverFileType: 'image/png',
        image:
          'https://yaaas-test.s3-us-east-2.amazonaws.com/1656680571719logo_black.png',
        name: 'BULLZ Collection',
        symbol: 'BULLZ',
        type: 'multiple',
        chain_id: process.env.CHAIN_ID_AVAL,
      },
      {
        address: process.env.ADMIN_COLLECTION_ARB_ERC1155.toLowerCase(),
        coverFileType: 'image/png',
        image:
          'https://yaaas-test.s3-us-east-2.amazonaws.com/1656680571719logo_black.png',
        name: 'BULLZ Collection',
        symbol: 'BULLZ',
        type: 'single',
        chain_id: process.env.CHAIN_ID_ARB,
      },
      {
        address: process.env.ADMIN_COLLECTION_ARB_ERC1155.toLowerCase(),
        coverFileType: 'image/png',
        image:
          'https://yaaas-test.s3-us-east-2.amazonaws.com/1656680571719logo_black.png',
        name: 'BULLZ Collection',
        symbol: 'BULLZ',
        type: 'multiple',
        chain_id: process.env.CHAIN_ID_ARB,
      },
    ];
    const collectionArray = [];
    defaultCollections.forEach((collectionData) => {
      const collection = new Collection();
      collection.address = collectionData.address;
      collection.coverFileType = collectionData.coverFileType;
      collection.image = collectionData.image;
      collection.name = collectionData.name;
      collection.symbol = collectionData.symbol;
      collection.type = collectionData.type;
      collection.chain_id = parseInt(collectionData.chain_id);
      collectionArray.push(collection);
    });

    return collectionArray;
  }
}
