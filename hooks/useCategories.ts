import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesAPI, Category } from '@/lib/api';
import { toast } from 'sonner';

export function useCategories(categoryId?: string) {
    const queryClient = useQueryClient();

    const { data: categories = [], isLoading: categoriesLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: categoriesAPI.getCategories,
        enabled: !categoryId
    });

    const { data: category, isLoading: categoryLoading } = useQuery({
        queryKey: ['categories', categoryId],
        queryFn: () => categoriesAPI.getCategory(categoryId!),
        enabled: !!categoryId
    });

    const createCategoryMutation = useMutation({
        mutationFn: categoriesAPI.createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success("Category created successfully");
        },
        onError: () => {
            toast.error("Failed to create category");
        }
    });

    const updateCategoryMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) =>
            categoriesAPI.updateCategory(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success("Category updated successfully");
        },
        onError: () => {
            toast.error("Failed to update category");
        }
    });

    const deleteCategoryMutation = useMutation({
        mutationFn: categoriesAPI.deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success("Category deleted successfully");
        },
        onError: () => {
            toast.error("Failed to delete category");
        }
    });

    const addSubcategoryMutation = useMutation({
        mutationFn: ({ id, subcategory }: { id: string; subcategory: string }) =>
            categoriesAPI.addSubcategory(id, subcategory),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success("Subcategory added successfully");
        },
        onError: () => {
            toast.error("Failed to add subcategory");
        }
    });

    const removeSubcategoryMutation = useMutation({
        mutationFn: ({ id, subcategory }: { id: string; subcategory: string }) =>
            categoriesAPI.removeSubcategory(id, subcategory),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success("Subcategory removed successfully");
        },
        onError: () => {
            toast.error("Failed to remove subcategory");
        }
    });

    return {
        categories: categories as Category[],
        category: category as Category,
        isLoading: categoryId ? categoryLoading : categoriesLoading,
        createCategory: (data: Partial<Category>) => createCategoryMutation.mutate(data),
        updateCategory: (id: string, data: Partial<Category>) => updateCategoryMutation.mutate({ id, data }),
        deleteCategory: (id: string) => deleteCategoryMutation.mutate(id),
        addSubcategory: (id: string, subcategory: string) => addSubcategoryMutation.mutate({ id, subcategory }),
        removeSubcategory: (id: string, subcategory: string) => removeSubcategoryMutation.mutate({ id, subcategory }),
        isCreating: createCategoryMutation.isPending,
        isUpdating: updateCategoryMutation.isPending,
        isDeleting: deleteCategoryMutation.isPending,
        isAddingSubcategory: addSubcategoryMutation.isPending,
        isRemovingSubcategory: removeSubcategoryMutation.isPending,
    };
}
