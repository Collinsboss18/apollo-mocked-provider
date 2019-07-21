import * as React from 'react';
import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
  ITypeDefinitions,
} from 'graphql-tools';
import ApolloClient from 'apollo-client';
import { SchemaLink } from 'apollo-link-schema';
import { ApolloCache } from 'apollo-cache';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProviderProps, ApolloProvider } from 'react-apollo';

export const createApolloMockedProvider = (
  typeDefs: ITypeDefinitions,
  globalCache?: ApolloCache<any>,
  provider?: React.ComponentType<ApolloProviderProps<any>>
) => ({
  customResolvers = {},
  cache,
  children,
}: {
  customResolvers?: any;
  children: React.ReactChild | JSX.Element;
  cache?: ApolloCache<any>;
}) => {
  // const mocks = mergeResolvers(globalMocks, props.customResolvers);

  const schema = makeExecutableSchema({
    typeDefs,
    resolverValidationOptions: { requireResolversForResolveType: false },
  });

  addMockFunctionsToSchema({ schema, mocks: customResolvers });

  const client = new ApolloClient({
    link: new SchemaLink({ schema }),
    cache: cache || globalCache || new InMemoryCache(),
  });

  const Provider = provider ? provider : ApolloProvider;
  return <Provider client={client}>{children}</Provider>;
};
