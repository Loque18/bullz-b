import { Injectable } from '@nestjs/common';

@Injectable()
export class DefaultCollections {
  getCollections() {
    return [
      {
        address: process.env.ADMIN_COLLECTION_ETH_ERC1155.toLowerCase(),
        coverImageType: 'image/png',
        image:
          'https://yaaas-test.s3-us-east-2.amazonaws.com/1656680571719logo_black.png',
        name: 'BULLZ Collection',
        symbol: 'BULLZ',
        type: 'single',
        chain_id: process.env.CHAIN_ID_ETH,
      },
      {
        address: process.env.ADMIN_COLLECTION_ETH_ERC1155.toLowerCase(),
        coverImageType: 'image/png',
        image:
          'https://yaaas-test.s3-us-east-2.amazonaws.com/1656680571719logo_black.png',
        name: 'BULLZ Collection',
        symbol: 'BULLZ',
        type: 'multiple',
        chain_id: process.env.CHAIN_ID_ETH,
      },
      {
        address: process.env.ADMIN_COLLECTION_BSC_ERC1155.toLowerCase(),
        coverImageType: 'image/png',
        image:
          'https://yaaas-test.s3-us-east-2.amazonaws.com/1656680571719logo_black.png',
        name: 'BULLZ Collection',
        symbol: 'BULLZ',
        type: 'single',
        chain_id: process.env.CHAIN_ID_BSC,
      },
      {
        address: process.env.ADMIN_COLLECTION_BSC_ERC1155.toLowerCase(),
        coverImageType: 'image/png',
        image:
          'https://yaaas-test.s3-us-east-2.amazonaws.com/1656680571719logo_black.png',
        name: 'BULLZ Collection',
        symbol: 'BULLZ',
        type: 'multiple',
        chain_id: process.env.CHAIN_ID_BSC,
      },
      {
        address: process.env.ADMIN_COLLECTION_POLY_ERC1155.toLowerCase(),
        coverImageType: 'image/png',
        image:
          'https://yaaas-test.s3-us-east-2.amazonaws.com/1656680571719logo_black.png',
        name: 'BULLZ Collection',
        symbol: 'BULLZ',
        type: 'single',
        chain_id: process.env.CHAIN_ID_POLY,
      },
      {
        address: process.env.ADMIN_COLLECTION_POLY_ERC1155.toLowerCase(),
        coverImageType: 'image/png',
        image:
          'https://yaaas-test.s3-us-east-2.amazonaws.com/1656680571719logo_black.png',
        name: 'BULLZ Collection',
        symbol: 'BULLZ',
        type: 'multiple',
        chain_id: process.env.CHAIN_ID_POLY,
      },
      {
        address: process.env.ADMIN_COLLECTION_AVAL_ERC1155.toLowerCase(),
        coverImageType: 'image/png',
        image:
          'https://yaaas-test.s3-us-east-2.amazonaws.com/1656680571719logo_black.png',
        name: 'BULLZ Collection',
        symbol: 'BULLZ',
        type: 'single',
        chain_id: process.env.CHAIN_ID_AVAL,
      },
      {
        address: process.env.ADMIN_COLLECTION_AVAL_ERC1155.toLowerCase(),
        coverImageType: 'image/png',
        image:
          'https://yaaas-test.s3-us-east-2.amazonaws.com/1656680571719logo_black.png',
        name: 'BULLZ Collection',
        symbol: 'BULLZ',
        type: 'multiple',
        chain_id: process.env.CHAIN_ID_AVAL,
      },
    ];
  }
}
