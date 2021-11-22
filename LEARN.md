# Build a platform for NGOs using NEAR
In this quest, we will learn how to build an NGO smart contract on NEAR. this contract will allow users to register NGOs, add projects, and donate.
You can write contracts on NEAR using AssemblyScript or Rust. In this quest, we will use AssemblyScript.
First, you can see some imports from NEAR's AssemblyScript SDK already there for you, those are utilities that will come in handy in the contract.

## Creating necessary classes 
So, every NGO has projects, right?
Thus, we need to create a class Project. Before writing a class, you have to include this line above class declaration:
```ts
@nearBindgen
```
This tag "announces" that your class compatible with NEAR. Let's create the class itself! notice that you have three lines here, following the example.
If you are wondering about the weird first two lines in the constructor, then this is just to generate a random variable.
Three things for you to do:
STEP 1 : initialize the address field with the parameter passed in the constructor.
STEP 2 : initialize name, the same way.
STEP 3 : initialize funds, the same way.
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
        /*STEP 1*/;
        /*STEP 2*/;
        /*STEP 3*/;
    }
}
```
cool, now we know how to create projects. But what about NGOs themselves?
Well, let's be fair and create a class NGO:

STEP 1 : assign id same as before.
But there is a little tweak when it comes to initializing address, we want this address to be the NEAR account id of the transaction sender (pretty much like msg.sender if you came from Solidity). in Near, this can be achieved by accessing context.sender, this comes from near-sdk-as imports (see the top of the code). So:
STEP 2 : save context.sender to address. 
```ts
@nearBindgen
export class NGO {
    id: u32;
    address: string;

    constructor() {
        const rng = new RNG<u32>(1, u32.MAX_VALUE);
        const roll = rng.next();
        /*STEP 1*/;
        /*STEP 2*/;
    }
}

```

## Creating utility lists
Now let's do some bookkeeping and keep lists that can make our life easier:
```ts
export const ngoList = new PersistentMap<u32, NGO>("n");
export const ngoIdList = new PersistentVector<u32>("nl");
export const projects = new PersistentMap<u32, Project>("p")
export const ngoProjectMap = new PersistentMap<u32, PersistentMap<u32, Project>>("np");
export const projectIdList = new PersistentVector<u32>("pl");
```
So these are just a bunch of key:value maps. You are maybe wondering what are these strings between parantheses doing at the end of each line. These strings are just storage prefixes that should be unique among all lists, this is because the state of contracts is a key-value storage.

## Registering NGOs
Ok, let's register an NGO, shall we? We need a function for this:
This function's body has four lines:
STEP 1: create an instance of class NGO (syntax : ```const nameOfInstance = new className() ```). Call this instance "ngo".
In the second line, you can see that the ngo is being pushed to the appropriate list. 
STEP 2 : push ngo.id to ngoIdList.
STEP 3: return ngo's id in the fourth line.
```ts
export function registerNGO(): u32 {
  /*STEP 1*/;
  ngoList.set(ngo.id,ngo);
  /*STEP 2*/;
  /*STEP 3*/;
}
```

## Adding projects
We also should allow creating projects, let's write a function for that:
First, we fetch the NGO to which the project will be added. If this NGO exists, we add the project. There are two lines for you to add here, the first one is to add a pair of {newProject.id, newProject} to projects list. it works in similar fashion to regidterNGO(), when we added ngo to ngoList.
STEP 1 : Set the newly created project in the projects map
STEP 2 : push newProjectId to its list.
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
        /*STEP 1*/;
        ngoProjectMap.set(ngoId, projects);
        /*STEP 2*/;

        return newProject.id;
    }
    else{
      return 0;
    }
    return 0;
}
```

## Creating getter functions
Let's write some useful getters (view functions). we need a function that returns a list of all NGOs (IDs). Let's write it!
So the most important line is waiting for you to write, it should simply copy the id at index i to ngos.
STEP 1 : push ngoIdList's ith member to ngos 
```ts
export function getNGO(): Array<u32> {
    let ngos = new Array<u32>();
    
    for(let i=0;i<ngoIdList.length;i++)
    {  
      logging.log("The value of length of ngoIdList is" + ngoIdList.length.toString());
       /*STEP 1*/;
    }
    return ngos;
}
```

The same way, we need a list of all projects. Do the same as in the last step, write a line that pushes projectIdList's ith member to projectList.
STEP 1 : pushe projectIdList's ith member to projectList! 
```ts
export function getProjects(ngoId:u32):Array<u32> {
    logging.log("Trying to get Projects")
    const projectList = new Array<u32>();
    const projectsNgo = ngoProjectMap.getSome(ngoId);
    for(let i=0;i<projectIdList.length;i++){
      logging.log("The value of length of ProjectIdList is" + projectIdList.length.toString());
      if (projectsNgo.contains(projectIdList[i])){
        /*STEP 1*/;
      }
    }
    return projectList; 
}
```

## Donating NEARs
What if we need to donate to a project? there should be a way to transfer NEARs between address, yeah?
Let's see how this can be programmed:
This is can be done using NEAR's ContractPromiseBatch (see:https://near.github.io/near-sdk-as/classes/_sdk_core_assembly_promise_.contractpromisebatch.html). We want our project to recieve funds so you should add two statements in donate():
```ts
const to_beneficiary = ContractPromiseBatch.create(//project address here);
to_beneficiary.transfer(//how much money was sent with the function call);
```
(See: https://near.github.io/near-sdk-as/classes/_sdk_core_assembly_promise_.contractpromisebatch.html#transfer).
Also, to the money sent whith the transaction can be queried using context.attachedDeposit, so this should be passed as a parameter to the transfer function.
STEP 1 : initialize to_beneficiary.
STEP 2 : transfer funds.
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
      /*STEP 1*/;
      /*STEP 2*/;
      return "Done";
    }
  }
  return "Could Not Complete";
}
```
And that is it! that was a n example of writing smart contracts on NEAR using AssemblyScript
