# Build a platform for NGOs using NEAR
**Why should NGO funding be decentralized?**
One of the biggest blockers for international non-profits is transparency when it comes to donation and spending of funds. Blockchain based smart contract ensure both trust and transparency, where the funds can be tracked easily on public blockchains like NEAR.
Another one of the issues we are trying to tackle here, is the ability for international audience to donate funds to a cause that is close to their heart.

In this quest, we will build a smart contract which would allow NGOs to register individual projects that they are running throughout the year and the ability for users to donate to these individual projects/causes.

## Contract functionality
- This contract will allow NGOs to register themselves, 
- add projects
- and allows users to donate to those projects

## Importing essential libraries/functions
You can write contracts on NEAR using Assembly Script or Rust. In this quest, we will use Assembly Script.
On the first line, you can see some imports from NEAR's Assembly Script SDK, which have already been added for you. 
These imports will come in handy in the contract.

## Creating necessary classes - Project Class
So, every NGO may have several projects, right? How do we create an entity that can represent a Project?
We would need to create a class **Project**. 
Before writing a class, you have to include the following line above the class declaration:
```ts
@nearBindgen
```
This tag is a decorator made for the serialization of custom classes before they are saved to storage onto the blockchain. 
Now, let's create the class itself! 

The class has variables and a constructor. Notice that you have three lines that are missing code snippets in the constructor, which you would need to fill.
If you were wondering about the weird first two lines in the constructor, don't worry about it. These lines are used to generate a random variable. 

Let us take a look at what you would need to do in the missing code snippets:

STEP 1 : Initialize the **address** field with the parameter passed in the constructor.

STEP 2 : Initialize the **name** field with the parameter passed in the constructor.

STEP 3 : Initialize the **funds** field with the parameter passed in the constructor.

```ts
class Project {
    id: u32;
    address: string;
    name: string;
    funds: u128;

    constructor(_address: string, _funds: u128, _name: string) {
        const rng = new RNG<u32>(1, u32.MAX_VALUE);
        const roll = rng.next();
        this.id = roll;
        /*FILL THE MISSING CODE SNIPPET HERE*/;
        /*FILL THE MISSING CODE SNIPPET HERE*/;
        /*FILL THE MISSING CODE SNIPPET HERE*/;
    }
}
```
Great, now we know how to create new projects.


## Creating necessary classes - NGO Class
We already know how to create new projects. But what about the NGOs?

Well, let's get on to it and create a class NGO. Creating an NGO class is the same process as that of the projects. You can go ahead and fill up the missing codesnippets in this class constructor too. However, pay close attention to the below steps before proceeding with the code.

STEP 1 : Assign the **id** field using the same syntax as in the project class constructor.

There is a little tweak when it comes to initializing address, we want this address to be the NEAR account id of the transaction sender (pretty much like msg.sender if you came from Solidity). In NEAR, this can be achieved by accessing context.sender.The context has been imported from near-sdk-as (see the import section of the code).

STEP 2 : Save the context.sender to address. 

```ts
@nearBindgen
export class NGO {
    id: u32;
    address: string;

    constructor() {
        const rng = new RNG<u32>(1, u32.MAX_VALUE);
        const roll = rng.next();
        /*FILL IN THE MISSING CODE SNIPPET*/;
        /*FILL IN THE MISSING CODE SNIPPET*/;
    }
}

```

## Creating utility lists
Now let's do some bookkeeping and create lists and maps that can make our life easier. Persistent Maps and Vectors are convenience collections built on top of the `Storage` class exposed by the NEAR platform. Each of these require a unique prefix per account.

```ts
export const ngoList = new PersistentMap<u32, NGO>("n");
export const ngoIdList = new PersistentVector<u32>("nl");
export const projects = new PersistentMap<u32, Project>("p")
export const ngoProjectMap = new PersistentMap<u32, PersistentMap<u32, Project>>("np");
export const projectIdList = new PersistentVector<u32>("pl");
```
So these are just a bunch of key:value maps. The unique prefixes are the strings between parentheses at the end of each line. These strings are just storage prefixes that should be unique among all lists, this is because the state of contracts is key-value storage.

## Registering NGOs
Ok, now, let's register an NGO, shall we? We need to write a function to perform this function. Let's call it **registerNGO**.
This function's body has four lines, where the missing code snippets would need to be filled up by you.

STEP 1: Create an instance of class NGO (syntax : ```const nameOfInstance = new className() ```). Call this instance "ngo".

In the second line, you can see that the ngo is being pushed to the appropriate list. 

STEP 2 : Push ngo.id to ngoIdList.

STEP 3: Return ngo's id in the fourth line.
```ts
export function registerNGO(): u32 {
  /*FILL IN THE MISSING CODE SNIPPET*/;
  ngoList.set(ngo.id,ngo);
  /*FILL IN THE MISSING CODE SNIPPET*/;
  /*FILL IN THE MISSING CODE SNIPPET*/;
}
```

## Adding projects
We also should allow creating projects, let's write a function for that.
First, we fetch the id of the NGO to which the project will be added. If this NGO exists, we add the project. There are two lines for you to add here, the first one is to add a pair of {newProject.id, newProject} to projects list. It works in a similar fashion to the registerNGO() function, when we added ngo to ngoList.

STEP 1 : Set the newly created project in the projects map.

STEP 2 : Push newProjectId to its list.

```ts
export function addProject(ngoId: u32, address: string, name: string, funds: string): u32{
    const ngoInstance = ngoList.getSome(ngoId);
    logging.log("Project Name is: " + name);
    logging.log("Project Address is: " + address);
    logging.log("Funds are: " + funds);
    const funds_u128 = u128.from(funds);
    const newProject = new Project(address, funds_u128, name);
    if(ngoInstance!=null){
        logging.log("NGO Instance is not null");
        /*FILL IN THE MISSING CODE SNIPPET */;
        ngoProjectMap.set(ngoId, projects);
        /*FILL IN THE MISSING CODE SNIPPET */;

        return newProject.id;
    }
    else{
      return 0;
    }
    return 0;
}
```

## Creating getter functions - Get NGOs
Let's write some useful getters (view functions) for our contract. 
We need a function that returns a list of all NGOs (IDs). 

Let's write it!

So the most important line is waiting for you to write it. You would need to add all the ngo ids using the index i to ngos array.
We will return an array of NGOs that is populated within the for loop by you.

STEP 1 : Push ngoIdList's i-th member to ngos 
```ts
export function getNGO(): Array<u32> {
    let ngos = new Array<u32>();
    
    for(let i=0;i<ngoIdList.length;i++)
    {  
       /*FILL IN THE MISSING CODE SNIPPET*/;
    }
    return ngos;
}
```
## Creating getter functions - Get Projects
The same way as NGOs, we need a list of all projects. Do the same as you did in the last step, write a line that pushes projectIdList's members to projectList.
You will end up returning an array of project IDs.

STEP 1 : Push projectIdList's ith member to projectList! 
```ts
export function getProjects(ngoId:u32):Array<u32> {
    
    const projectList = new Array<u32>();
    const projectsNgo = ngoProjectMap.getSome(ngoId);
    for(let i=0;i<projectIdList.length;i++){
      
      if (projectsNgo.contains(projectIdList[i])){
        /*FILL IN THE MISSING CODE SNIPPET*/;
      }
    }
    return projectList; 
}
```

## Donating NEARs
What if we need to donate to a project? 
There should be a way to transfer NEARs between addresses, right?
Let's see how this can be programmed.

This is can be done using NEAR's ContractPromiseBatch (see - https://near.github.io/near-sdk-as/classes/_sdk_core_assembly_promise_.contractpromisebatch.html). We want our project to receive funds so you should add two statements in the **donate** function.This is also known as a cross-contract call.

```ts
const to_beneficiary = ContractPromiseBatch.create(//project account here);
to_beneficiary.transfer(//How much money was sent with the function call);
```

(See: https://near.github.io/near-sdk-as/classes/_sdk_core_assembly_promise_.contractpromisebatch.html#transfer).
Also, the money sent with the transaction can be queried using context.attachedDeposit, so this should be passed as a parameter to the transfer function.

STEP 1 : Initialize the **to_beneficiary** variable.

STEP 2 : Transfer funds.

```ts
export function donate(ngoId:u32,projectId:u32): string
{
    for(let i=0;i<ngoIdList.length;i++){
      if(ngoList.contains(ngoId)){
      const projects = ngoProjectMap.getSome(ngoId);
      const project = projects.getSome(projectId);

      project.funds = u128.sub(project.funds, context.attachedDeposit);
      projects.set(project.id, project);
      ngoProjectMap.set(ngoId, projects);
      /*FILL IN THE MISSING CODE SNIPPET*/;
      /*FILL IN THE MISSING CODE SNIPPET*/;
      return "Done";
    }
  }
  return "Could Not Complete";
}
```

## Quest Completed
And voila! We have successfully written a smart contract that can create an NGO and it's corresponding projects, facilitating donations by users in NEAR. That was an amazing example of writing smart contracts on NEAR using the Assembly Script.
You are now ready to take up advanced quests and code on NEAR Protocol. 
Happy coding!
