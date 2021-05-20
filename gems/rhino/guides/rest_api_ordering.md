# Rhino REST API - Ordering

This guide demonstrates use cases for the Order Sieve. This sieve is used when an `order` parameter is found in the query parameters, _e.g._ `?order=created_at`.

## General usage

The canonical use case for the order sieve is to sort results by a certain column. For example, if it is needed to sort users by their birthday, the request and its query parameters could be:

```
/users?order=birthday
```

## Ascending vs. Descending

By default, the ascending order will be used, i.e. `order=age` means the younger ones (lower age) would the first results.

In order to use the descending order, a leading dash must be used in front of the column name. So

```
/users?order=-age
```

would use the descending order and return older people (greater age) as the first results.

### Multiple clauses

Multiple order clauses are supported. It is possible, for instance, to order users by name and, if two people have the same the name, order by age then. For that, column names should be separated by commas.

```
/users?order=name,-age
```
