### using localstack to install & configure opensearch (wip)

* run `docker-compose up localstack`
* create local opensearch domain using, `awslocal opensearch create-domain --domain-name my-domain`
* wait for it to complete processing. check the status using, `awslocal opensearch describe-domain --domain-name my-domain | jq ".DomainStatus.Processing"`
* use curl to interact with cluster using, `curl -s http://my-domain.ap-southeast-2.opensearch.localhost.localstack.cloud:4566/_cluster/health | jq .`
* run `docker-compose up opensearch-dashboard`
