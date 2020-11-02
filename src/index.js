import 'dotenv/config'
import { Client } from '@elastic/elasticsearch'

const QueryBuilder = require('@asymmetrik/elastic-querybuilder');

console.log(process.env.ELASTICSEARCH);

const builder = new QueryBuilder();

async function main() {
    //let query = builder.query('match', 'search', 'dnds').build();
    let query = builder.size(0).must('match','type',3).aggs('cardinality', 'catalog_uuid').build();
    console.log(query);

    const client = new Client({ node: process.env.ELASTICSEARCH });
    console.log('ping: '+JSON.stringify(await client.ping()));

    const result = await client.search({
        index: 'dig_metas',
        body: query
    });
    if (result.statusCode!==200){
        console.log('Error ES Query');
        return;
    }
    console.warn('<<<Result>>>: '+JSON.stringify(result));
}

main().catch(console.log);