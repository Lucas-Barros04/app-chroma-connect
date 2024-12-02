import { Observable, of } from "rxjs"
import { Memes } from "./memes.interface"
import { allMemes } from "src/app/mocks/memes"

export const ApiServiceMock:{
    obtieneMemes: () => Observable<Memes>
} = {
    obtieneMemes: () => of(allMemes),
}