# Supabase Permission Setup

To fix the "permission denied for table computed_stats" error, follow these steps in your Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Policies
3. Find the `computed_stats` table
4. Click "New Policy"
5. Use the quick template "Enable read access for all users"
6. Set the policy name to "Enable read access for computed_stats"
7. The policy should look like:

```sql
CREATE POLICY "Enable read access for computed_stats"
ON public.computed_stats
FOR SELECT
TO anon, authenticated
USING (true);
```

8. Click "Save Policy"

9. Do the same for the `metric_definition` table:
```sql
CREATE POLICY "Enable read access for metric_definition"
ON public.metric_definition
FOR SELECT
TO anon, authenticated
USING (true);
```

10. Make sure Row Level Security (RLS) is enabled on both tables:
```sql
ALTER TABLE public.computed_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metric_definition ENABLE ROW LEVEL SECURITY;
```

These settings allow read access to both tables for all users, including anonymous users, which is appropriate for dashboard visualization data.
