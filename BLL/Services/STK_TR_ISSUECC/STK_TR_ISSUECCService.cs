using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.Stk_TR_IssueToCC
{
   public class Stk_TR_IssueToCCService : IStk_TR_IssueToCCService
    {
        private readonly IUnitOfWork unitOfWork;

        public Stk_TR_IssueToCCService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }


        #region I_D_Category Services
        public I_Stk_TR_IssueToCC GetById(int id)
        {
            return unitOfWork.Repository<I_Stk_TR_IssueToCC>().GetById(id);
        }

        public List<I_Stk_TR_IssueToCC> GetAll()
        {
            return unitOfWork.Repository<I_Stk_TR_IssueToCC>().GetAll();
        }
       
        public List<I_Stk_TR_IssueToCC> GetAll(Expression<Func<I_Stk_TR_IssueToCC, bool>> predicate)
        {
            return unitOfWork.Repository<I_Stk_TR_IssueToCC>().Get(predicate);
        }

        public I_Stk_TR_IssueToCC Insert(I_Stk_TR_IssueToCC entity)
        {
            var memb = unitOfWork.Repository<I_Stk_TR_IssueToCC>().Insert(entity);
            unitOfWork.Save();
            return memb;
        }

        public I_Stk_TR_IssueToCC Update(I_Stk_TR_IssueToCC entity)
        {

            var memb = unitOfWork.Repository<I_Stk_TR_IssueToCC>().Update(entity);
            unitOfWork.Save();
            return memb;
        }
        public I_Stk_TR_IssueToCCDetails Update(I_Stk_TR_IssueToCCDetails entity)
        {

            var memb = unitOfWork.Repository<I_Stk_TR_IssueToCCDetails>().Update(entity);
            unitOfWork.Save();
            return memb;
        } 
         public I_Stk_TR_IssueToCCDetails Insert(I_Stk_TR_IssueToCCDetails entity)
        {

            var memb = unitOfWork.Repository<I_Stk_TR_IssueToCCDetails>().Insert(entity);
            unitOfWork.Save();
            return memb;
        }
        public void Delete(int id)
        {
            unitOfWork.Repository<I_Stk_TR_IssueToCCDetails>().Delete(id);
            unitOfWork.Save();
        }


        #endregion


        #region  I_D_IssueType
        public List<I_D_IssueType> GetIssueTypes()
        {
            return unitOfWork.Repository<I_D_IssueType>().GetAll();
        }

        public List<I_D_IssueType> GetIssueTypes(Expression<Func<I_D_IssueType, bool>> predicate)
        {
            return unitOfWork.Repository<I_D_IssueType>().Get(predicate);
        }

        public I_D_IssueType InsertIssueTypes(I_D_IssueType entity)
        {
            var memb = unitOfWork.Repository<I_D_IssueType>().Insert(entity);
            unitOfWork.Save();
            return memb;
        }


        public I_D_IssueType UpdateIssueTypes(I_D_IssueType entity)
        {

            var memb = unitOfWork.Repository<I_D_IssueType>().Update(entity);
            unitOfWork.Save();
            return memb;
        }

        public void DeleteIssueTypes(int id)
        {
            unitOfWork.Repository<I_D_IssueType>().Delete(id);
            unitOfWork.Save();
        }

        #endregion
    }
}
