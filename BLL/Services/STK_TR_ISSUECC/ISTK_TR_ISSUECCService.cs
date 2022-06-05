using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.Stk_TR_IssueToCC
{
   public interface IStk_TR_IssueToCCService
    {
        I_Stk_TR_IssueToCC GetById(int id);
        List<I_Stk_TR_IssueToCC> GetAll(); 
        List<I_Stk_TR_IssueToCC> GetAll(Expression<Func<I_Stk_TR_IssueToCC, bool>> predicate);
        I_Stk_TR_IssueToCC Insert(I_Stk_TR_IssueToCC entity);
        I_Stk_TR_IssueToCC Update(I_Stk_TR_IssueToCC entity);
        I_Stk_TR_IssueToCCDetails Insert(I_Stk_TR_IssueToCCDetails entity);
        I_Stk_TR_IssueToCCDetails Update(I_Stk_TR_IssueToCCDetails entity);
        void Delete(int id);

        List<I_D_IssueType> GetIssueTypes();
        List<I_D_IssueType> GetIssueTypes(Expression<Func<I_D_IssueType, bool>> predicate);
        I_D_IssueType InsertIssueTypes(I_D_IssueType entity);
        I_D_IssueType UpdateIssueTypes(I_D_IssueType entity);
        void DeleteIssueTypes(int id);
    }
}
