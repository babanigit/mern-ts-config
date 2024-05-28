import { NoteModel } from "../aModal/noteModal";
import { UserModel } from "../aModal/userModal";
import { ConflictError, UnauthorizedError } from "../zErrors/http-errors";

// will update this links

// http://localhost:4000
// https://note-management-api-pvjm.onrender.com/api/notes/


// const noteLink = "http://localhost:4000/api/notes/";
// const noteLink = "https://note-management-thsi.onrender.com/api/notes/";

// const noteLink = "https://typescript-mocha-phi.vercel.app/api/notes/";
const noteLink = "api/notes/";

// const userLink = "http://localhost:4000/api/users/";
// const userLink = "https://note-management-thsi.onrender.com/api/users/";

// const userLink = "https://typescript-mocha-phi.vercel.app/api/users/";
const userLink = "api/users/";



// we used this to handle the errors while fetching the data from api
async function fetchData(input: RequestInfo, init?: RequestInit) {

    console.log("fetchData",input,init)

    const res = await fetch(input, init);
    if (res.ok) {
        return res;
    } else {
        // errorBody > errorMessage > throw Error.
        const errorBody = await res.json();
        const errorMessage = errorBody.error;

        if(res.status===401) {
            throw new UnauthorizedError(errorMessage)
        }else if(res.status===409) {
            throw new ConflictError(errorMessage);
        }else{
            throw Error("request failed with status: " + res.status + " message "+ errorMessage);
        }

    }
}


// get loggedIn user details
export async function getLoggedInUser():Promise<UserModel>{

    const res= await fetchData(userLink,{method:"GET"});

    console.log("getLoggedInUser from note_api");
    
    return res.json();
}


// get register
export interface RegisterCred {
    userName:string;
    email:string;
    passwd:string;
}
export async function getRegisterUser(Credential:RegisterCred):Promise<UserModel>{

    const res= await fetchData(userLink+"register",{
        method:"POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(Credential),
    });

    console.log("getReg from note_api")

    return res.json();
}

// get login
export interface LoginCred {
    userName:string;
    passwd:string;
}
export async function getLoginUser(Credential:LoginCred):Promise<UserModel>{

    console.log("getLoginUserFetchData ", Credential)

    const res= await fetchData(userLink+"login",{
        method:"POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(Credential),
    });

    console.log("getLoginUser from note_api")
    return res.json();
}

// get logout
export async function getLogout(){

    await fetchData(userLink+"logout",{method:"POST"});
}



// NOTES SECTION

// fetch notes
export async function fetchNotes(): Promise<NoteModel[]> {
    const res = await fetchData(noteLink, {
        method: "GET",
    });
    return await res.json();
}

export interface NoteInput {
    // title: string;
    // text?: string;

    _id:string;
    title:string;
    text?:string;
    createdAt:string;
    updatedAt:string;
}

// to create note
export async function createNote(note: NoteInput): Promise<NoteModel> {
    const res = await fetchData(noteLink, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
    });
    return res.json();
}

// update notes
export async function updateNote(
    noteId: string,
    note: NoteInput
): Promise<NoteInput> {
    const res = await fetchData(noteLink + noteId, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
    });

    return res.json();
}

// delete note
export async function deleteNote(noteId: string) {
    await fetchData(noteLink + noteId, { method: "DELETE" });
}


