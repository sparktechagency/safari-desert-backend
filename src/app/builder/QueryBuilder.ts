import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  // Search functionality for multiple fields
  search(searchableFields: string[]) {
    const search = this?.query?.search as string;
    if (search) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map((field) => ({
          [field]: { $regex: search, $options: 'i' }, // case-insensitive search
        })),
      });
    }
    return this;
  }



  // filter() {

  //   const queryObj: Record<string, unknown> = { ...this.query };
  //   const exclude = ['search', 'sort', 'limit', 'page', 'fields'];
  //   exclude.forEach((k) => delete queryObj[k]);

  //   const mongo: Record<string, unknown> = {};
  //   for (const [key, raw] of Object.entries(queryObj)) {
  //     if (raw == null) continue;
  //     if (typeof raw === 'string') {
      
  //       if (/^(true|false)$/i.test(raw)) {
  //         mongo[key] = /^true$/i.test(raw);
  //         continue;
  //       }
     
  //       mongo[key] = {
  //         $regex: `^${raw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`,
  //         $options: 'i',
  //       };
  //     } else {
  //       mongo[key] = raw;
  //     }
  //   }

  //   this.modelQuery = this.modelQuery.find(mongo as FilterQuery<any>);
  //   return this;
  // }

filter() {
  const queryObj: Record<string, unknown> = { ...this.query };
  const exclude = ['search', 'sort', 'limit', 'page', 'fields'];
  exclude.forEach((k) => delete queryObj[k]);

  const mongo: Record<string, unknown> = {};

  // Loop through all the query parameters
  for (const [key, raw] of Object.entries(queryObj)) {
    if (raw == null) continue;

    // Special case for availability
    if (key === 'availability') {
      const date = typeof raw === 'string' ? raw : (raw as string[])[0];
      if (date) {
        // Use AND logic for all filters, availability uses $lte and $gte to check the date range
        mongo['availability.start'] = { $lte: date };
        mongo['availability.end'] = { $gte: date };
      }
      continue;
    }

    // Handle max_adult and child_min_age logic as numbers and apply the required filters
    if (key === 'max_adult' || key === 'child_min_age') {
      if (typeof raw === 'string' && isNaN(Number(raw))) {
        throw new Error(`Invalid value for ${key}. Expected a number, got "${raw}".`);
      }

      const value = Number(raw);

      // Apply filter: max_adult should be greater than or equal to the passed value
      if (key === 'max_adult') {
        mongo[key] = { $gte: value }; // For max_adult: >= passedValue
      } 

      // Apply filter: child_min_age should be greater than or equal to the passed value
      else if (key === 'child_min_age') {
        mongo[key] = { $gte: value }; // For child_min_age: >= passedValue
      }

      continue;
    }

    // Handle other fields as strings or booleans
    if (typeof raw === 'string') {
      if (/^(true|false)$/i.test(raw)) {
        mongo[key] = /^true$/i.test(raw);
        continue;
      }
      mongo[key] = {
        $regex: `^${raw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`,
        $options: 'i',
      };
    } else {
      mongo[key] = raw;
    }
  }

  // Apply the filters as AND conditions
  this.modelQuery = this.modelQuery.find(mongo as FilterQuery<any>);
  return this;
}



  // Sorting functionality
  sort() {
    const sort =
      (this?.query?.sort as string)?.split(',')?.join(' ') || '-createdAt'; // Default to descending by createdAt
    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }

  // Pagination functionality
  paginate() {
    const page = Number(this.query?.page) || 1;
    const limit = Number(this.query?.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  // Fields selection (allow dynamic field inclusion/exclusion)
  fields() {
    const fields =
      (this.query?.fields as string)?.split(',')?.join(' ') || '-__v'; // Default to excluding __v field
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  // Count total records for pagination metadata
  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(totalQueries);
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }
}

export default QueryBuilder;
