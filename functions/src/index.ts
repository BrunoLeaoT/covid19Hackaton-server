import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as bodyParser from "body-parser";

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

const app = express();
const main = express();

main.use('/api/v1', app);
main.use(bodyParser.json());

export const webApi = functions.https.onRequest(main);

function getId(min:number, max:number) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

app.get('/warmup', (request, response) => {

    response.send('Warming up friend.');

})

//Fornecedor
app.post('/Fornecedor', async (request, response) => {
    try {
      const { nome, username, password } = request.body;
      const data = {
        username,
        password
      } 
      const fornecedorRef = await db.collection('Fornecedor');
      fornecedorRef.doc(nome).set(data);
      //const forne = await fornecedorRef.get();
  
      response.json({
        id: fornecedorRef.id,
        data: data
      });
      
    } catch(error){
  
      response.status(500).send(error);
  
    }
});

app.get('/Fornecedor/:id', async (request, response) => {
try {
    const fornId = request.params.id;

    if (!fornId) throw new Error('Fornecedor ID is required');

    const forne = await db.collection('Fornecedor').doc(fornId).get();

    if (!forne.exists){
        throw new Error('Fornecedor doesnt exist.')
    }

    response.json({
    id: forne.id,
    data: forne.data()
    });

} catch(error){

    response.status(500).send(error);

}

});


app.get('/Fornecedor', async (request, response) => {
    try {

        const fightQuerySnapshot = await db.collection('Fornecedor').get();
        const forne:Object[] = [];
        fightQuerySnapshot.forEach(
            (doc) => {
                forne.push({
                    id: doc.id,
                    data: doc.data()
                });
            }
        );

        response.json(forne);

    } catch(error){

        response.status(500).send(error);

    }

});

app.post('/Restaurante', async (request, response) => {
    try {
      const { nome, username, password } = request.body;
      const data = {
        username,
        password
      } 
      const restauranteRef = await db.collection('Restaurante');
      restauranteRef.doc(nome).set(data);
  
      response.json({
        id: restauranteRef.id,
        data: data
      });
      
    } catch(error){
  
      response.status(500).send(error);
  
    }
});

app.get('/Restaurante/:id', async (request, response) => {
    try {
        const restId = request.params.id;
    
        if (!restId) throw new Error('restaurante ID is required');
    
        const rest = await db.collection('Restaurante').doc(restId).get();
    
        if (!rest.exists){
            throw new Error('Fornecedor doesnt exist.')
        }
    
        response.json({
        id: rest.id,
        data: rest.data()
        });
    
    } catch(error){
    
        response.status(500).send(error);
    
    }
    
});

app.get('/Restaurante', async (request, response) => {
    try {

        const fightQuerySnapshot = await db.collection('Restaurante').get();
        const rests:Object[] = [];
        fightQuerySnapshot.forEach(
            (doc) => {
                rests.push({
                    id: doc.id,
                    data: doc.data()
                });
            }
        );

        response.json(rests);

    } catch(error){

        response.status(500).send(error);

    }

});

app.post('/CarrinhoDeCompras', async (request, response) => {
    try {
    
      const { nome} = request.body;
      const ID = getId(100,200);
      const cod = nome+"-"+ID;
      const data = {
        cod
      } 
      const restauranteRef = await db.collection('CarrinhoDeCompras');
      restauranteRef.doc(cod).set(data);
  
      response.json({
        id: restauranteRef.id,
        data: data
      });
      
    } catch(error){
        
      response.status(500).send(error);
  
    }
});
app.get('/CarrinhoDeCompras', async (request, response) => {
    try {
        const shopQuerySnapshot = await db.collection('CarrinhoDeCompras').get();
        const carrinhs:Object[] = [];
        shopQuerySnapshot.forEach(
            (doc) => {
                carrinhs.push({
                    id: doc.id,
                    data: doc.data()
                });
            }
        );

        response.json(carrinhs);

    } catch(error){

        response.status(500).send(error);

    }

});
app.get('/CarrinhoDeCompras/:id', async (request, response) => {
    try {
        const propostaId = request.params.id;
    
        if (!propostaId) throw new Error('Proposta ID is required');
    
        const prodsQuerySnapshot = await db.collection('CarrinhoDeCompras').doc(propostaId);
        const produtosQuery = await prodsQuerySnapshot.collection('Produtos').get();
        const prods:Object[] = [];
        produtosQuery.forEach(
            (doc) => {
                prods.push({
                    id: doc.id,
                    data: doc.data()
                });
            }
        );

        response.json(prods);

    } catch(error){

        response.status(500).send(error);

    }

    
});
app.post('/CarrinhoProdutos/', async (request, response) => {
    
    
    try {
        
        const { restCod,nome ,quantidade} = request.body;
        let data = {
            quantidade: parseInt(quantidade)
          } 
        const docRef = await db.collection('CarrinhoDeCompras').doc(restCod).collection('Produtos').doc(nome);
        docRef.set(data);
        response.json({
            data: {nome, quantidade}
        });
      
    } catch(error){
        response.status(500).send(error);
    }
});



app.post('/Propostas', async (request, response) => {
    try {
    
      const { fornecedor, restauranteCod} = request.body;
      const ID = getId(0,100);
      const cod =fornecedor+"-"+ID;
      const data = {
        cod,
        restauranteCod
      } 
      const propostaRef = await db.collection('Propostas');
      propostaRef.doc(cod).set(data);
  
      response.json({
        id: fornecedor+"-"+ID,
        data: data
      });
      
    } catch(error){
        
      response.status(500).send(error);
  
    }
});

app.get('/Propostas/:id', async (request, response) => {
    try {
        const propostaId = request.params.id;
    
        if (!propostaId) throw new Error('Proposta ID is required');
    
        const prodsQuerySnapshot = await db.collection('Propostas').doc(propostaId);
        const produtosQuery = await prodsQuerySnapshot.collection('Produtos').get();
        const prods:Object[] = [];
        produtosQuery.forEach(
            (doc) => {
                prods.push({
                    id: doc.id,
                    data: doc.data()
                });
            }
        );

        response.json(prods);

    } catch(error){

        response.status(500).send(error);

    }
});
app.get('/Propostas', async (request, response) => {
    try {

        const shopQuerySnapshot = await db.collection('Propostas').get();
        const propostas:Object[] = [];
        shopQuerySnapshot.forEach(
            (doc) => {
                propostas.push({
                    id: doc.id,
                    data: doc.data()
                });
            }
        );

        response.json(propostas);

    } catch(error){

        response.status(500).send(error);

    }
    
});


app.post('/CarrinhoProposta/', async (request, response) => {
    
    try {
        const { codProposta,nome,quantidade, valor} = request.body;
        let data = {
            quantidade: parseInt(quantidade),
            valor: parseFloat(valor)
          } 
        const docRef = await db.collection('Propostas').doc(codProposta).collection('Produtos').doc(nome);
        docRef.set(data);
        response.json({
            data: {nome, quantidade, valor}
        });
      
    } catch(error){
        response.status(500).send(error);
    }
});

app.post('/Aceite/', async (request, response) => {
    
    try {
        const { codProposta, codCarrinho} = request.body;
        let data = {
            codCarrinho: codCarrinho,
            codProposta: codProposta
          } 
        const docRef = await db.collection('Aceite').doc(codProposta+"-"+codCarrinho);
        docRef.set(data);
        response.json({
            data: data
        });
      
    } catch(error){
        response.status(500).send(error);
    }
});


