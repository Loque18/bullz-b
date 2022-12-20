export class ERC721Property{
   type: string
   descrption: string
}
export class ERC721Properties{
    name: ERC721Property
    description: ERC721Property
    image: ERC721Property
}
export class ERC721Metadata{
        title: string
        type:string
        properties: ERC721Properties
}